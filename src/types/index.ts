// User Types
export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Seller Types
export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string;
  storeLogo?: string;
  storeBanner?: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  joinedDate: Date;
  isVerified: boolean;
  commissionRate: number;
}

// Product Types
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  inventory: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  rating: number;
  reviewCount: number;
  soldCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
  priceAdjustment: number;
  inventory: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  subcategories?: Category[];
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  sellerId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

// Analytics Types
export interface SellerAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  recentOrders: Order[];
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
}

// Admin Types
export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSellers: number;
  pendingOrders: number;
}

export interface AdminUser extends User {
  isActive: boolean;
  lastLogin?: Date;
}

export interface AdminSeller extends Seller {
  user: User;
  isActive: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'review' | 'system';
  read: boolean;
  createdAt: Date;
  link?: string;
}

// Wishlist Types
export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

// Search Types
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStock?: boolean;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}
