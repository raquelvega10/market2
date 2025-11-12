import { Search, ShoppingCart, CreditCard, Truck, CheckCircle } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      icon: Search,
      title: 'Explora',
      description: 'Navega por nuestro catálogo y encuentra los productos que necesitas'
    },
    {
      icon: ShoppingCart,
      title: 'Selecciona',
      description: 'Agrega productos al carrito y ajusta cantidades según tu necesidad'
    },
    {
      icon: CreditCard,
      title: 'Paga Seguro',
      description: 'Completa tu compra con múltiples métodos de pago seguros'
    },
    {
      icon: Truck,
      title: 'Recibe',
      description: 'Entrega rápida y segura directamente en la dirección indicada'
    }
  ];

  return (
    <section id="proceso" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green bg-opacity-10 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-brand-green" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Proceso Simple y Rápido</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compra en línea de forma segura en solo 4 pasos
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-brand-green via-brand-green to-brand-green opacity-20"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-brand-green-dark rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green bg-opacity-10 rounded-full">
            <CheckCircle className="w-5 h-5 text-brand-green" />
            <span className="text-brand-green font-semibold">Proceso 100% seguro y confiable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
