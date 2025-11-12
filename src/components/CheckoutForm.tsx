import { useState, useEffect, useRef } from 'react';
import { X, User, MapPin, CreditCard, Plus, Minus, Trash2, Check } from 'lucide-react';
import { CartItem } from '../types/cart';
import { supabase, PaymentMethod } from '../lib/supabase';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSubmit: (orderData: OrderFormData) => Promise<void>;
  onUpdateQuantity: (productName: string, quantity: number) => void;
  onRemoveItem: (productName: string) => void;
}

export interface OrderFormData {
  cliente_fullname: string;
  cliente_pais: string;
  cliente_email: string;
  cliente_contacto: string;
  receptor_fullname: string;
  receptor_ci: string;
  receptor_contacto: string;
  receptor_direccion: string;
  receptor_adicionales: string;
  payment_method: string;
}

export function CheckoutForm({ items, total, onClose, onSubmit, onUpdateQuantity, onRemoveItem }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState<OrderFormData>({
    cliente_fullname: '',
    cliente_pais: '',
    cliente_email: '',
    cliente_contacto: '',
    receptor_fullname: '',
    receptor_ci: '',
    receptor_contacto: '',
    receptor_direccion: '',
    receptor_adicionales: '',
    payment_method: '',
  });
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setPaymentMethods(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, payment_method: data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      if (formContainerRef.current) {
        formContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const steps = [
    { number: 1, title: 'Remitente', icon: User },
    { number: 2, title: 'Receptor', icon: MapPin },
    { number: 3, title: 'Pago', icon: CreditCard }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-7xl rounded-lg sm:rounded-2xl shadow-2xl my-4 sm:my-8 flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[90vh]">
        <div ref={formContainerRef} className="lg:w-2/3 overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Finalizar Pedido</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep > step.number ? 'bg-brand-green text-white' :
                      currentStep === step.number ? 'bg-brand-green text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step.number ? <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <step.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                    </div>
                    <span className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium ${currentStep >= step.number ? 'text-brand-green' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 ${currentStep > step.number ? 'bg-brand-green' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {currentStep === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-brand-green" />
                  <h3 className="text-xl font-bold text-gray-900">Datos del Remitente</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                    <input type="text" name="cliente_fullname" required value={formData.cliente_fullname} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                    <input type="text" name="cliente_pais" required value={formData.cliente_pais} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="Estados Unidos" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="cliente_email" required value={formData.cliente_email} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="email@ejemplo.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto *</label>
                    <input type="tel" name="cliente_contacto" required value={formData.cliente_contacto} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="+1 234 567 8900" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-6 h-6 text-brand-green" />
                  <h3 className="text-xl font-bold text-gray-900">Datos del Receptor</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                    <input type="text" name="receptor_fullname" required value={formData.receptor_fullname} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="María García" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de identidad *</label>
                    <input type="text" name="receptor_ci" required value={formData.receptor_ci} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="12345678901" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto *</label>
                    <input type="tel" name="receptor_contacto" required value={formData.receptor_contacto} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent" placeholder="+53 5 234 5678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección completa *</label>
                    <textarea name="receptor_direccion" required value={formData.receptor_direccion} onChange={handleChange} rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none" placeholder="Calle, número, municipio, provincia" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                    <textarea name="receptor_adicionales" value={formData.receptor_adicionales} onChange={handleChange} rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none" placeholder="Referencias adicionales para la entrega" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-brand-green" />
                  <h3 className="text-xl font-bold text-gray-900">Método de Pago</h3>
                </div>
                {paymentMethods.length > 0 ? (
                  <select name="payment_method" value={formData.payment_method} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent">
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.name}>
                        {method.description || method.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-600">Cargando métodos de pago...</p>
                )}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Atrás
                </button>
              )}
              <button type="submit" disabled={loading}
                className="flex-1 bg-brand-green text-white py-3 px-6 rounded-xl font-bold hover:bg-brand-green-dark active:scale-95 transition-all duration-200 disabled:opacity-50">
                {loading ? 'Procesando...' : currentStep === 3 ? 'Terminar Pedido' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-1/3 bg-gray-50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h3>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.product_name} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>
                    <p className="text-brand-green font-bold">${Number(item.price).toFixed(2)}</p>
                  </div>
                  <button onClick={() => onRemoveItem(item.product_name)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                    <button onClick={() => onUpdateQuantity(item.product_name, item.quantity - 1)} disabled={item.quantity <= 1}
                      className="p-2 text-gray-600 hover:text-brand-green disabled:text-gray-300 disabled:cursor-not-allowed">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product_name, item.quantity + 1)} disabled={item.quantity >= item.stock_available}
                      className="p-2 text-gray-600 hover:text-brand-green disabled:text-gray-300 disabled:cursor-not-allowed">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Envío:</span>
              <span className="font-semibold text-brand-green">GRATIS</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-300">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-brand-green">${total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
