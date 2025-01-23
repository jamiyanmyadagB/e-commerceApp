import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Heart,
  Package,
  LogOut,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getCartItemsCount } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getCartItemsCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop' },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md' 
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-[#f27a2a] rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                MarketPlace
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path 
                      ? 'text-[#f27a2a]' 
                      : 'text-[#444444] hover:text-[#f27a2a]'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#f27a2a] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border-[#d9d9d9] focus:border-[#f27a2a] focus:ring-[#f27a2a]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Mobile Search */}
              <button 
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigate('/shop')}
              >
                <Search className="w-5 h-5 text-[#444444]" />
              </button>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-[#444444]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f27a2a] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f27a2a&color=fff`}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="hidden sm:block text-sm font-medium text-[#444444]">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#666666]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium text-[#1a1a1a]">{user?.name}</p>
                      <p className="text-xs text-[#666666]">{user?.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </DropdownMenuItem>
                    {user?.role === 'seller' && (
                      <DropdownMenuItem onClick={() => navigate('/seller')}>
                        <Store className="w-4 h-4 mr-2" />
                        Seller Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Store className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="hidden sm:flex"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#444444]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#444444]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-in slide-in-from-top-5">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-[#f27a2a]/10 text-[#f27a2a]' 
                      : 'text-[#444444] hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#f27a2a] rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  MarketPlace
                </span>
              </div>
              <p className="text-[#999999] text-sm leading-relaxed">
                Your premier destination for quality products from around the world. 
                Discover amazing items from verified sellers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Shop', 'Categories', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link 
                      to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                      className="text-[#999999] hover:text-[#f27a2a] transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-3">
                {['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <Link 
                      to="#"
                      className="text-[#999999] hover:text-[#f27a2a] transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-[#999999] text-sm">
                <li>support@marketplace.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Commerce St, New York, NY 10001</li>
              </ul>
              <div className="flex gap-4 mt-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#f27a2a] transition-colors"
                  >
                    <span className="capitalize text-xs">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#333333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#666666] text-sm">
              © 2024 MarketPlace. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-[#666666] hover:text-[#f27a2a] text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-[#666666] hover:text-[#f27a2a] text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
