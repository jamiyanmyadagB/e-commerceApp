import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, Address } from '@/types';
import { useProductStore } from './productStore';
import { useCartStore } from './cartStore';
import { useAuthStore } from './authStore';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  
  // Actions
  createOrder: (shippingAddress: Address, billingAddress: Address) => Promise<Order | null>;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Order | undefined;
  fetchOrdersBySeller: (sellerId: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  
  // Analytics
  getSellerAnalytics: (sellerId: string) => {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    salesData: Array<{ date: string; sales: number; orders: number }>;
  };
}

// Mock orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [
      {
        productId: '1',
        sellerId: '1',
        name: 'Premium Leather Tote Bag',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop'
      }
    ],
    subtotal: 129.99,
    tax: 10.40,
    shipping: 0,
    discount: 0,
    total: 140.39,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-002',
    userId: '1',
    items: [
      {
        productId: '2',
        sellerId: '2',
        name: 'Wireless Noise-Canceling Headphones',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
      },
      {
        productId: '7',
        sellerId: '2',
        name: 'Portable Bluetooth Speaker',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop'
      }
    ],
    subtotal: 249.98,
    tax: 20.00,
    shipping: 0,
    discount: 25.00,
    total: 244.98,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-03'),
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD-003',
    userId: '2',
    items: [
      {
        productId: '3',
        sellerId: '2',
        name: 'Smart Watch Pro',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'
      }
    ],
    subtotal: 299.99,
    tax: 24.00,
    shipping: 15.00,
    discount: 0,
    total: 338.99,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Commerce Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    billingAddress: {
      street: '456 Commerce Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      isLoading: false,

      createOrder: async (shippingAddress: Address, billingAddress: Address) => {
        set({ isLoading: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { user } = useAuthStore.getState();
        const { items, discountAmount, clearCart } = useCartStore.getState();
        const { products } = useProductStore.getState();
        
        if (!user || items.length === 0) {
          set({ isLoading: false });
          return null;
        }
        
        const orderItems = items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            sellerId: product?.sellerId || '',
            name: product?.name || '',
            price: product?.price || 0,
            quantity: item.quantity,
            image: product?.images[0] || '',
            variant: item.variantId
          };
        });
        
        const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 50 ? 0 : 15;
        const total = subtotal + tax + shipping - discountAmount;
        
        const newOrder: Order = {
          id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          userId: user.id,
          items: orderItems,
          subtotal,
          tax,
          shipping,
          discount: discountAmount,
          total,
          status: 'pending',
          paymentStatus: 'pending',
          shippingAddress,
          billingAddress,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ orders: [...state.orders, newOrder] }));
        clearCart();
        set({ isLoading: false });
        
        return newOrder;
      },

      fetchOrders: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
      },

      fetchOrderById: (id: string) => {
        return get().orders.find(o => o.id === id);
      },

      fetchOrdersBySeller: (sellerId: string) => {
        return get().orders.filter(o => o.items.some(item => item.sellerId === sellerId));
      },

      updateOrderStatus: async (orderId: string, status: OrderStatus) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const orderIndex = get().orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return false;
        
        const newOrders = [...get().orders];
        newOrders[orderIndex] = {
          ...newOrders[orderIndex],
          status,
          updatedAt: new Date()
        };
        
        set({ orders: newOrders });
        return true;
      },

      cancelOrder: async (orderId: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const orderIndex = get().orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return false;
        
        const order = get().orders[orderIndex];
        if (order.status === 'delivered' || order.status === 'cancelled') {
          return false;
        }
        
        const newOrders = [...get().orders];
        newOrders[orderIndex] = {
          ...newOrders[orderIndex],
          status: 'cancelled',
          updatedAt: new Date()
        };
        
        set({ orders: newOrders });
        return true;
      },

      getSellerAnalytics: (sellerId: string) => {
        const sellerOrders = get().orders.filter(o => 
          o.items.some(item => item.sellerId === sellerId) && 
          o.status !== 'cancelled' &&
          o.paymentStatus === 'paid'
        );
        
        const totalRevenue = sellerOrders.reduce((sum, order) => {
          const sellerItems = order.items.filter(item => item.sellerId === sellerId);
          const itemsTotal = sellerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
          return sum + itemsTotal;
        }, 0);
        
        const totalOrders = sellerOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Generate last 30 days of sales data
        const salesData: Array<{ date: string; sales: number; orders: number }> = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayOrders = sellerOrders.filter(o => 
            o.createdAt.toISOString().split('T')[0] === dateStr
          );
          
          const daySales = dayOrders.reduce((sum, order) => {
            const sellerItems = order.items.filter(item => item.sellerId === sellerId);
            return sum + sellerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
          }, 0);
          
          salesData.push({
            date: dateStr,
            sales: daySales,
            orders: dayOrders.length
          });
        }
        
        return {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          salesData
        };
      }
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ orders: state.orders })
    }
  )
);
