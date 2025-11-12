import { ShoppingCart } from 'lucide-react';

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Navbar({ cartItemsCount, onCartClick }: NavbarProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <img
              src="/logo png.png"
              alt="RMoney Market"
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                RMoney Market
              </h1>
              <p className="text-sm text-gray-600">Tienda Online</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('proceso')}
              className="text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              Proceso
            </button>
            <button
              onClick={() => scrollToSection('productos')}
              className="text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection('testimonios')}
              className="text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              Testimonios
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              Contacto
            </button>
          </div>

          <button
            onClick={onCartClick}
            className="relative p-3 text-gray-700 hover:text-brand-green transition-colors rounded-lg hover:bg-gray-50"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
