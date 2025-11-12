import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface StockMovement {
  id: number;
  product_name: string;
  saldo_inicial: number;
  movement_type: string;
  quantity: number;
  saldo_final: number;
  note: string;
  created_at: string;
}

interface Product {
  name: string;
}

export function StockManagement() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        supabase.from('stock').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('name').order('name'),
      ]);

      if (movementsRes.error) throw movementsRes.error;
      if (productsRes.error) throw productsRes.error;

      setMovements(movementsRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando movimientos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveMovement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const movementData = {
      product_name: formData.get('product_name') as string,
      movement_type: formData.get('movement_type') as string,
      quantity: parseFloat(formData.get('quantity') as string),
      note: formData.get('note') as string,
    };

    try {
      const { data: lastMovement } = await supabase
        .from('stock')
        .select('saldo_final')
        .eq('product_name', movementData.product_name)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const saldo_inicial = lastMovement?.saldo_final || 0;
      const saldo_final =
        movementData.movement_type === 'entrada'
          ? saldo_inicial + movementData.quantity
          : saldo_inicial - movementData.quantity;

      const { error } = await supabase.from('stock').insert({
        ...movementData,
        saldo_inicial,
        saldo_final,
      });

      if (error) throw error;

      await loadData();
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error registrando movimiento');
    }
  }

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Stock</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Movimiento</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Saldo Inicial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Saldo Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {movement.product_name}
                  </td>
                  <td className="px-6 py-4">
                    {movement.movement_type === 'entrada' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Entrada</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">Salida</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {movement.saldo_inicial}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-brand-green">
                    {movement.saldo_final}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {movement.note || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(movement.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {movements.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No hay movimientos de stock registrados</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Nuevo Movimiento de Stock</h3>
            </div>
            <form onSubmit={handleSaveMovement} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto
                </label>
                <select
                  name="product_name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map((product) => (
                    <option key={product.name} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Movimiento
                </label>
                <select
                  name="movement_type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="entrada">Entrada (Agregar stock)</option>
                  <option value="salida">Salida (Reducir stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  step="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota (Opcional)
                </label>
                <textarea
                  name="note"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="Ej: Compra de mercancía, venta, ajuste de inventario..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-white py-2 px-4 rounded-lg hover:bg-brand-green-dark"
                >
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
