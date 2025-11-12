import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  DollarSign,
  Package,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Box,
  BarChart3,
  Warehouse
} from 'lucide-react';

export function Sidebar() {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        <NavLink
          to="/admin_dashboard/pedidos"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-brand-green text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">Pedidos</span>
        </NavLink>

        <NavLink
          to="/admin_dashboard/ventas"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-brand-green text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <DollarSign className="w-5 h-5" />
          <span className="font-medium">Ventas</span>
        </NavLink>

        <div>
          <button
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium">Inventario</span>
            </div>
            {inventoryOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {inventoryOpen && (
            <div className="ml-4 mt-1 space-y-1">
              <NavLink
                to="/admin_dashboard/inventario/clasificacion"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-green bg-opacity-10 text-brand-green'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Clasificación</span>
              </NavLink>

              <NavLink
                to="/admin_dashboard/inventario/productos"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-green bg-opacity-10 text-brand-green'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Box className="w-4 h-4" />
                <span>Productos</span>
              </NavLink>

              <NavLink
                to="/admin_dashboard/inventario/disponibilidad"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-green bg-opacity-10 text-brand-green'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4" />
                <span>Disponibilidad</span>
              </NavLink>

              <NavLink
                to="/admin_dashboard/inventario/stock"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-green bg-opacity-10 text-brand-green'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Warehouse className="w-4 h-4" />
                <span>Stock</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
