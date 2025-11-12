import { ArrowRight, ShoppingBag } from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
  onContactClick: () => void;
}

export function HeroSection({ onShopClick, onContactClick }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Tu tienda online{' '}
              <span className="text-brand-green">en Cuba</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Compra productos de calidad desde cualquier parte del mundo. Pagos seguros en USD y entrega garantizada en toda Cuba.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onShopClick}
                className="group bg-brand-green text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-green-dark transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-6 h-6" />
                Ver Productos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onContactClick}
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border-2 border-white/20"
              >
                Contáctanos
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-brand-green mb-2">100%</div>
                  <div className="text-sm text-gray-300">Entregas Exitosas</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-brand-green mb-2">24/7</div>
                  <div className="text-sm text-gray-300">Atención al Cliente</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-brand-green mb-2">1000+</div>
                  <div className="text-sm text-gray-300">Productos</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-brand-green mb-2">USD</div>
                  <div className="text-sm text-gray-300">Pagos Seguros</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
