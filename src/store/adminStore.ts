import { create } from 'zustand';
import type { User, Seller, PlatformStats } from '@/types';

interface AdminState {
  users: User[];
  sellers: Seller[];
  pendingSellers: Seller[];
  isLoading: boolean;
  
  // Actions
  fetchPlatformStats: () => Promise<PlatformStats>;
  fetchAllUsers: () => Promise<User[]>;
  fetchAllSellers: () => Promise<Seller[]>;
  approveSeller: (sellerId: string) => Promise<boolean>;
  rejectSeller: (sellerId: string) => Promise<boolean>;
  suspendUser: (userId: string) => Promise<boolean>;
  activateUser: (userId: string) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  featureProduct: (productId: string) => Promise<boolean>;
}

// Extended mock data for admin
const mockAdminUsers: User[] = [
  {
    id: '1',
    email: 'customer@example.com',
    name: 'John Customer',
    role: 'customer',
    createdAt: new Date('2024-01-15'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    email: 'seller@example.com',
    name: 'Jane Seller',
    role: 'seller',
    createdAt: new Date('2024-01-10'),
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    email: 'techhub@example.com',
    name: 'Tech Hub Owner',
    role: 'seller',
    createdAt: new Date('2024-02-15'),
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    email: 'homecomfort@example.com',
    name: 'Sarah Home',
    role: 'seller',
    createdAt: new Date('2024-01-20'),
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  }
];

const mockAdminSellers: Seller[] = [
  {
    id: '1',
    userId: '2',
    storeName: 'Jane\'s Boutique',
    storeDescription: 'Premium fashion and accessories',
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
    storeDescription: 'Latest gadgets and electronics',
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
    storeDescription: 'Beautiful home decor essentials',
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

const mockPendingSellers: Seller[] = [
  {
    id: '4',
    userId: '6',
    storeName: 'Sports World',
    storeDescription: 'Sports equipment and fitness gear',
    storeLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    rating: 0,
    reviewCount: 0,
    totalSales: 0,
    joinedDate: new Date('2024-03-15'),
    isVerified: false,
    commissionRate: 0.10
  }
];

export const useAdminStore = create<AdminState>((set, get) => ({
  users: mockAdminUsers,
  sellers: mockAdminSellers,
  pendingSellers: mockPendingSellers,
  isLoading: false,

  fetchPlatformStats: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
    
    return {
      totalUsers: mockAdminUsers.length,
      totalSellers: mockAdminSellers.length,
      totalProducts: 12,
      totalOrders: 156,
      totalRevenue: 45678.90,
      pendingSellers: mockPendingSellers.length,
      pendingOrders: 8
    };
  },

  fetchAllUsers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
    return get().users;
  },

  fetchAllSellers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
    return get().sellers;
  },

  approveSeller: async (sellerId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const pendingIndex = get().pendingSellers.findIndex(s => s.id === sellerId);
    if (pendingIndex === -1) return false;
    
    const seller = get().pendingSellers[pendingIndex];
    const approvedSeller = { ...seller, isVerified: true };
    
    set(state => ({
      pendingSellers: state.pendingSellers.filter(s => s.id !== sellerId),
      sellers: [...state.sellers, approvedSeller]
    }));
    
    return true;
  },

  rejectSeller: async (sellerId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    set(state => ({
      pendingSellers: state.pendingSellers.filter(s => s.id !== sellerId)
    }));
    
    return true;
  },

  suspendUser: async (_userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  activateUser: async (_userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  deleteProduct: async (_productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  featureProduct: async (_productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}));
