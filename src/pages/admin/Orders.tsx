import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, Loader2, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  cliente_fullname: string;
  receptor_fullname: string;
  order_date: string;
  status: string;
  total: number;
  payment_method: string;
}

interface OrderDetail extends Order {
  cliente_pais: string;
  cliente_email: string;
  cliente_contacto: string;
  receptor_ci: string;
  receptor_contacto: string;
  receptor_direccion: string;
  receptor_adicionales: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmada', label: 'Confirmada', color: 'bg-blue-100 text-blue-800' },
  { value: 'enviada', label: 'Enviada', color: 'bg-purple-100 text-purple-800' },
  { value: 'completada', label: 'Completada', color: 'bg-green-100 text-green-800' },
  { value: 'vendido', label: 'Vendido', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando pedidos');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const oldStatus = orders.find(o => o.id === orderId)?.status;

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;

      if (newStatus === 'vendido' && oldStatus !== 'vendido') {
        await createSaleFromOrder(orderId);
      }

      await loadOrders();
      if (selectedOrder?.id === orderId) {
        await loadOrderDetail(orderId);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error actualizando estado');
    }
  }

  async function createSaleFromOrder(orderId: string) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('total, payment_method')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: existingSale } = await supabase
        .from('sales')
        .select('id')
        .eq('order_id', orderId)
        .maybeSingle();

      if (existingSale) {
        return;
      }

      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          order_id: orderId,
          total: orderData.total,
          payment_method: orderData.payment_method || 'efectivo',
        });

      if (saleError) throw saleError;
    } catch (err) {
      console.error('Error creating sale:', err);
      throw new Error('Error registrando venta');
    }
  }

  async function loadOrderDetail(orderId: string) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      setSelectedOrder({
        ...orderData,
        order_items: itemsData || [],
      });
      setShowDetail(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error cargando detalle');
    }
  }

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
        <span className="text-sm text-gray-600">{orders.length} pedidos</span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Receptor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.cliente_fullname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.receptor_fullname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )} border-0 cursor-pointer`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => loadOrderDetail(order.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Ver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Detalle del Pedido</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Información del Cliente</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Nombre:</span> {selectedOrder.cliente_fullname}</p>
                    <p><span className="font-medium">País:</span> {selectedOrder.cliente_pais}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.cliente_email}</p>
                    <p><span className="font-medium">Contacto:</span> {selectedOrder.cliente_contacto}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Información del Receptor</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Nombre:</span> {selectedOrder.receptor_fullname}</p>
                    <p><span className="font-medium">CI:</span> {selectedOrder.receptor_ci}</p>
                    <p><span className="font-medium">Contacto:</span> {selectedOrder.receptor_contacto}</p>
                    <p><span className="font-medium">Dirección:</span> {selectedOrder.receptor_direccion}</p>
                    {selectedOrder.receptor_adicionales && (
                      <p><span className="font-medium">Adicionales:</span> {selectedOrder.receptor_adicionales}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Información del Pedido</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Fecha:</span> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                    <p><span className="font-medium">Estado:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {STATUS_OPTIONS.find(s => s.value === selectedOrder.status)?.label}
                      </span>
                    </p>
                    <p><span className="font-medium">Método de pago:</span> {selectedOrder.payment_method || 'N/A'}</p>
                    <p><span className="font-medium">Total:</span> <span className="text-lg font-bold">${Number(selectedOrder.total).toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Productos del Pedido</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${Number(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-brand-green">
                      ${Number(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
