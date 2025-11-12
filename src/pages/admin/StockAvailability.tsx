import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle, Package } from 'lucide-react';

interface StockView {
  product_name: string;
  category_name: string;
  sub_category_name: string;
  saldo_final: number;
}

export function StockAvailability() {
  const [stockData, setStockData] = useState<StockView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadStockData();
  }, []);

  async function loadStockData() {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('name, category_name, sub_category_name')
        .order('name');

      if (productsError) throw productsError;

      const { data: stockData, error: stockError } = await supabase
        .from('stock_productos')
        .select('product_name, stock_actual');

      if (stockError) throw stockError;

      const stockMap = new Map(
        (stockData || []).map((item) => [item.product_name, Number(item.stock_actual) || 0])
      );

      const combinedData = (productsData || []).map((product) => ({
        product_name: product.name,
        category_name: product.category_name,
        sub_category_name: product.sub_category_name,
        saldo_final: stockMap.get(product.name) || 0,
      }));

      setStockData(combinedData);

      const uniqueCategories = [
        ...new Set(combinedData.map((item) => item.category_name).filter(Boolean)),
      ];
      setCategories(uniqueCategories as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando disponibilidad');
    } finally {
      setLoading(false);
    }
  }

  const filteredData = stockData.filter((item) => {
    const matchesSearch =
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sub_category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (saldo: number) => {
    if (saldo <= 0) return { label: 'Sin stock', color: 'text-red-600 bg-red-50' };
    if (saldo < 10) return { label: 'Stock bajo', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Disponible', color: 'text-green-600 bg-green-50' };
  };

  const totalProducts = filteredData.length;
  const inStock = filteredData.filter((item) => item.saldo_final > 0).length;
  const lowStock = filteredData.filter(
    (item) => item.saldo_final > 0 && item.saldo_final < 10
  ).length;
  const outOfStock = filteredData.filter((item) => item.saldo_final <= 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Disponibilidad de Stock</h2>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{totalProducts}</p>
          <p className="text-sm text-gray-600">Productos</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Disponibles</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{inStock}</p>
          <p className="text-sm text-gray-600">Con stock</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Stock Bajo</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{lowStock}</p>
          <p className="text-sm text-gray-600">Menos de 10</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Sin Stock</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{outOfStock}</p>
          <p className="text-sm text-gray-600">Agotados</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar producto
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o subcategoría..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subcategoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const status = getStockStatus(item.saldo_final);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.category_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.sub_category_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {item.saldo_final}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
