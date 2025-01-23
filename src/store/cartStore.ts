import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/types';
import { useProductStore } from './productStore';

interface CartState extends Cart {
  isLoading: boolean;
  
  // Actions
  addToCart: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Getters
  getCartItemsCount: () => number;
  getCartTotal: () => number;
  getCartItemsWithDetails: () => Array<CartItem & { product: any; subtotal: number }>;
}

// Mock coupon codes
const validCoupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
  'SAVE10': { discount: 10, type: 'percentage' },
  'SAVE20': { discount: 20, type: 'percentage' },
  'WELCOME15': { discount: 15, type: 'percentage' },
  'FLAT50': { discount: 50, type: 'fixed' },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      discountAmount: 0,
      isLoading: false,

      addToCart: (productId: string, quantity: number, variantId?: string) => {
        const { items } = get();
        
        const existingItemIndex = items.findIndex(
          item => item.productId === productId && item.variantId === variantId
        );
        
        if (existingItemIndex >= 0) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, { productId, quantity, variantId }] });
        }
      },

      removeFromCart: (productId: string, variantId?: string) => {
        const { items } = get();
        set({
          items: items.filter(
            item => !(item.productId === productId && item.variantId === variantId)
          )
        });
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }
        
        const newItems = items.map(item =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        );
        
        set({ items: newItems });
      },

      clearCart: () => {
        set({ items: [], couponCode: undefined, discountAmount: 0 });
      },

      applyCoupon: (code: string) => {
        const coupon = validCoupons[code.toUpperCase()];
        if (!coupon) return false;
        
        const cartTotal = get().getCartTotal();
        let discount = 0;
        
        if (coupon.type === 'percentage') {
          discount = cartTotal * (coupon.discount / 100);
        } else {
          discount = Math.min(coupon.discount, cartTotal);
        }
        
        set({ couponCode: code.toUpperCase(), discountAmount: discount });
        return true;
      },

      removeCoupon: () => {
        set({ couponCode: undefined, discountAmount: 0 });
      },

      getCartItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getCartTotal: () => {
        const { items } = get();
        const products = useProductStore.getState().products;
        
        return items.reduce((total, item) => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            return total + product.price * item.quantity;
          }
          return total;
        }, 0);
      },

      getCartItemsWithDetails: () => {
        const { items } = get();
        const products = useProductStore.getState().products;
        
        return items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            ...item,
            product,
            subtotal: product ? product.price * item.quantity : 0
          };
        }).filter(item => item.product !== undefined);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items, 
        couponCode: state.couponCode,
        discountAmount: state.discountAmount 
      })
    }
  )
);
