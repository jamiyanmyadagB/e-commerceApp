import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Seller } from '@/types';

interface AuthState {
  user: User | null;
  seller: Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  becomeSeller: (storeData: Partial<Seller>) => Promise<boolean>;
  updateSellerProfile: (updates: Partial<Seller>) => void;
}

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'customer@example.com',
    password: 'password',
    name: 'John Customer',
    role: 'customer',
    createdAt: new Date('2024-01-15'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    phone: '+1 555-0101',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    id: '2',
    email: 'seller@example.com',
    password: 'password',
    name: 'Jane Seller',
    role: 'seller',
    createdAt: new Date('2024-01-10'),
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    phone: '+1 555-0102',
    address: {
      street: '456 Commerce Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  }
];

const mockSellers: Seller[] = [
  {
    id: '1',
    userId: '2',
    storeName: 'Jane\'s Boutique',
    storeDescription: 'Premium fashion and accessories curated with love. We offer the latest trends at affordable prices.',
    storeLogo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    storeBanner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 256,
    totalSales: 1523,
    joinedDate: new Date('2024-01-10'),
    isVerified: true,
    commissionRate: 0.10
  },
  {
    id: '2',
    userId: '4',
    storeName: 'TechHub Electronics',
    storeDescription: 'Your one-stop shop for the latest gadgets and electronics. Quality guaranteed.',
    storeLogo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    storeBanner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 189,
    totalSales: 987,
    joinedDate: new Date('2024-02-15'),
    isVerified: true,
    commissionRate: 0.08
  },
  {
    id: '3',
    userId: '5',
    storeName: 'Home Comfort',
    storeDescription: 'Beautiful home decor and living essentials to make your space truly yours.',
    storeLogo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    storeBanner: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 312,
    totalSales: 2104,
    joinedDate: new Date('2024-01-20'),
    isVerified: true,
    commissionRate: 0.12
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      seller: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          const seller = foundUser.role === 'seller' 
            ? mockSellers.find(s => s.userId === foundUser.id) || null
            : null;
          
          set({ 
            user: userWithoutPassword, 
            seller,
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      register: async (name: string, email: string, password: string, role: UserRole) => {
        set({ isLoading: true });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (mockUsers.some(u => u.email === email)) {
          set({ isLoading: false });
          return false;
        }
        
        const newUser: User = {
          id: String(mockUsers.length + 1),
          email,
          name,
          role,
          createdAt: new Date(),
        };
        
        mockUsers.push({ ...newUser, password });
        
        set({ 
          user: newUser, 
          isAuthenticated: true,
          isLoading: false 
        });
        
        return true;
      },

      logout: () => {
        set({ 
          user: null, 
          seller: null,
          isAuthenticated: false 
        });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      becomeSeller: async (storeData: Partial<Seller>) => {
        const { user } = get();
        if (!user) return false;
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newSeller: Seller = {
          id: String(mockSellers.length + 1),
          userId: user.id,
          storeName: storeData.storeName || `${user.name}'s Store`,
          storeDescription: storeData.storeDescription || '',
          rating: 0,
          reviewCount: 0,
          totalSales: 0,
          joinedDate: new Date(),
          isVerified: false,
          commissionRate: 0.10,
          ...storeData
        };
        
        mockSellers.push(newSeller);
        
        const updatedUser = { ...user, role: 'seller' as UserRole };
        set({ 
          seller: newSeller,
          user: updatedUser
        });
        
        return true;
      },

      updateSellerProfile: (updates: Partial<Seller>) => {
        const { seller } = get();
        if (seller) {
          set({ seller: { ...seller, ...updates } });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        seller: state.seller,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
