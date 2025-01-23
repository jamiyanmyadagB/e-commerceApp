import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store/authStore';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import SellerLayout from '@/layouts/SellerLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import CategoryPage from '@/pages/CategoryPage';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Orders from '@/pages/Orders';
import Wishlist from '@/pages/Wishlist';

// Seller Pages
import SellerDashboard from '@/pages/seller/Dashboard';
import SellerProducts from '@/pages/seller/Products';
import SellerOrders from '@/pages/seller/Orders';
import SellerAnalytics from '@/pages/seller/Analytics';
import SellerSettings from '@/pages/seller/Settings';
import AddProduct from '@/pages/seller/AddProduct';
import EditProduct from '@/pages/seller/EditProduct';
import BecomeSeller from '@/pages/seller/BecomeSeller';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminSellers from '@/pages/admin/Sellers';
import AdminProducts from '@/pages/admin/Products';
import AdminOrders from '@/pages/admin/Orders';

// Protected Route Components
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'seller' && user?.role !== 'admin') return <Navigate to="/become-seller" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Customer Routes */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="order-success/:orderId" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="become-seller" element={
            <ProtectedRoute>
              <BecomeSeller />
            </ProtectedRoute>
          } />
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={
          <SellerRoute>
            <SellerLayout />
          </SellerRoute>
        }>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
