import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle, DollarSign } from 'lucide-react';

interface Sale {
  id: string;
  order_id: string;
  sale_date: string;
  total: number;
  payment_method: string;
  created_at: string;
}

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    today: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });

      if (error) throw error;

      const salesData = data || [];
      setSales(salesData);

      const total = salesData.reduce((sum, sale) => sum + Number(sale.total), 0);
      const count = salesData.length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySales = salesData.filter(
        (sale) => new Date(sale.sale_date) >= today
      );
      const todayTotal = todaySales.reduce((sum, sale) => sum + Number(sale.total), 0);

      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthSales = salesData.filter(
        (sale) => new Date(sale.sale_date) >= firstDayOfMonth
      );
      const monthTotal = monthSales.reduce((sum, sale) => sum + Number(sale.total), 0);

      setStats({
        total,
        count,
        today: todayTotal,
        thisMonth: monthTotal,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando ventas');
    } finally {
      setLoading(false);
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      paypal: 'PayPal',
    };
    return labels[method] || method;
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-brand-green">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-green bg-opacity-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ${stats.total.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">{stats.count} ventas</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Hoy</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ${stats.today.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Ventas de hoy</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Este Mes</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ${stats.thisMonth.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Ventas del mes</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Promedio</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ${stats.count > 0 ? (stats.total / stats.count).toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-gray-600">Por venta</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha de Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registrado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {sale.order_id?.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(sale.sale_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-brand-green">
                    ${Number(sale.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getPaymentMethodLabel(sale.payment_method)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No hay ventas registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
