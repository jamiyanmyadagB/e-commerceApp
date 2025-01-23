import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  Shield,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Sellers', path: '/admin/sellers', icon: Store },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Admin Header */}
      <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-[#f27a2a] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Admin Panel
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#999999] hidden sm:block">Administrator</span>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-[#f27a2a] text-white'
                          : 'text-[#444444] hover:bg-[#f9f9f9] hover:text-[#f27a2a]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Link 
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#444444] hover:bg-[#f9f9f9] hover:text-[#f27a2a] transition-all"
                >
                  <Store className="w-5 h-5" />
                  <span className="font-medium">View Store</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
