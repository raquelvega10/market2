import { Package, ShoppingCart } from 'lucide-react';
import { Product, StockProducto } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
  stock: StockProducto | undefined;
  onAddToCart: (product: Product, stock: number) => void;
}

export function ProductCard({ product, stock, onAddToCart }: ProductCardProps) {
  const stockAvailable = stock?.stock_actual || 0;
  const isOutOfStock = stockAvailable <= 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-gray-300" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Agotado</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-brand-green">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product, stockAvailable)}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-brand-green text-white hover:bg-brand-green-dark active:scale-95'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isOutOfStock ? 'No disponible' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
