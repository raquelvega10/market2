import { useAuth } from '../contexts/AuthContext';
import { LogOut, Package } from 'lucide-react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { Orders } from './admin/Orders';
import { Sales } from './admin/Sales';
import { Classification } from './admin/Classification';
import { Products } from './admin/Products';
import { StockAvailability } from './admin/StockAvailability';
import { StockManagement } from './admin/StockManagement';

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/administracion');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">RMoney Market</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-brand-green capitalize">{user?.role || 'Administrador'}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<Orders />} />
            <Route path="ventas" element={<Sales />} />
            <Route path="inventario/clasificacion" element={<Classification />} />
            <Route path="inventario/productos" element={<Products />} />
            <Route path="inventario/disponibilidad" element={<StockAvailability />} />
            <Route path="inventario/stock" element={<StockManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
