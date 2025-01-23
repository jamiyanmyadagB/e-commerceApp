import { create } from 'zustand';
import type { Product, Category, Review, SearchFilters } from '@/types';

interface ProductState {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  featuredProducts: Product[];
  isLoading: boolean;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: string) => Product | undefined;
  fetchReviews: (productId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  searchProducts: (query: string, filters?: SearchFilters) => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsBySeller: (sellerId: string) => Product[];
  getRelatedProducts: (productId: string) => Product[];
  
  // Seller actions
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'soldCount'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

// Mock Categories
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and tech accessories',
    image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&h=600&fit=crop',
    icon: 'laptop',
    productCount: 156
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
    icon: 'shirt',
    productCount: 243
  },
  {
    id: '3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Beautiful home decor and essentials',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
    icon: 'home',
    productCount: 189
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports gear and fitness equipment',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop',
    icon: 'dumbbell',
    productCount: 98
  },
  {
    id: '5',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare and beauty products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    icon: 'sparkles',
    productCount: 167
  },
  {
    id: '6',
    name: 'Books',
    slug: 'books',
    description: 'Books and educational materials',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
    icon: 'book',
    productCount: 124
  }
];

// Mock Products
const mockProducts: Product[] = [
  {
    id: '1',
    sellerId: '1',
    name: 'Premium Leather Tote Bag',
    description: 'Handcrafted from genuine full-grain leather, this elegant tote bag combines timeless style with everyday functionality. Features multiple compartments and a durable cotton lining.',
    price: 129.99,
    compareAtPrice: 159.99,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop'
    ],
    category: 'Fashion',
    tags: ['leather', 'bag', 'accessories', 'premium'],
    inventory: 25,
    sku: 'LTB-001',
    weight: 0.8,
    rating: 4.8,
    reviewCount: 124,
    soldCount: 456,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '2',
    sellerId: '2',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Experience crystal-clear audio with industry-leading noise cancellation. 30-hour battery life and premium comfort for all-day wear.',
    price: 199.99,
    compareAtPrice: 249.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop'
    ],
    category: 'Electronics',
    tags: ['headphones', 'audio', 'wireless', 'bluetooth'],
    inventory: 50,
    sku: 'WH-002',
    weight: 0.3,
    rating: 4.6,
    reviewCount: 89,
    soldCount: 723,
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: '3',
    sellerId: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone integration. Water-resistant with 7-day battery life.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop'
    ],
    category: 'Electronics',
    tags: ['smartwatch', 'fitness', 'wearable', 'tech'],
    inventory: 35,
    sku: 'SW-003',
    weight: 0.05,
    rating: 4.7,
    reviewCount: 156,
    soldCount: 892,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: '4',
    sellerId: '1',
    name: 'Designer Sunglasses',
    description: 'UV400 protection with polarized lenses. Lightweight titanium frame with premium finish.',
    price: 159.99,
    compareAtPrice: 199.99,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop'
    ],
    category: 'Fashion',
    tags: ['sunglasses', 'accessories', 'eyewear'],
    inventory: 40,
    sku: 'DS-004',
    weight: 0.1,
    rating: 4.5,
    reviewCount: 67,
    soldCount: 234,
    isActive: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '5',
    sellerId: '3',
    name: 'Minimalist Running Shoes',
    description: 'Lightweight breathable mesh with responsive cushioning. Perfect for daily runs and gym sessions.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop'
    ],
    category: 'Sports',
    tags: ['shoes', 'running', 'fitness', 'sports'],
    inventory: 60,
    sku: 'RS-005',
    weight: 0.7,
    rating: 4.4,
    reviewCount: 98,
    soldCount: 567,
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: '6',
    sellerId: '3',
    name: 'Minimalist Canvas Backpack',
    description: 'Water-resistant canvas with laptop compartment. Clean design for everyday use.',
    price: 79.99,
    compareAtPrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop'
    ],
    category: 'Fashion',
    tags: ['backpack', 'bag', 'accessories'],
    inventory: 45,
    sku: 'CB-006',
    weight: 0.6,
    rating: 4.6,
    reviewCount: 78,
    soldCount: 345,
    isActive: true,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-03-02')
  },
  {
    id: '7',
    sellerId: '2',
    name: 'Portable Bluetooth Speaker',
    description: '360-degree sound with 20-hour battery. Waterproof and dustproof for outdoor adventures.',
    price: 49.99,
    compareAtPrice: 69.99,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop'
    ],
    category: 'Electronics',
    tags: ['speaker', 'audio', 'bluetooth', 'portable'],
    inventory: 80,
    sku: 'BS-007',
    weight: 0.4,
    rating: 4.3,
    reviewCount: 134,
    soldCount: 678,
    isActive: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-03-06')
  },
  {
    id: '8',
    sellerId: '2',
    name: 'Fitness Tracker Band',
    description: 'Track steps, calories, sleep, and heart rate. Slim design with 14-day battery life.',
    price: 69.99,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=800&fit=crop'
    ],
    category: 'Sports',
    tags: ['fitness', 'tracker', 'wearable', 'health'],
    inventory: 100,
    sku: 'FT-008',
    weight: 0.03,
    rating: 4.2,
    reviewCount: 156,
    soldCount: 892,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '9',
    sellerId: '3',
    name: 'Ceramic Vase Set',
    description: 'Handcrafted ceramic vases in neutral tones. Perfect for modern home decor.',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1612196808214-b7e239e5bbae?w=800&h=800&fit=crop'
    ],
    category: 'Home & Living',
    tags: ['home', 'decor', 'vase', 'ceramic'],
    inventory: 30,
    sku: 'CV-009',
    weight: 1.2,
    rating: 4.7,
    reviewCount: 45,
    soldCount: 178,
    isActive: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-25')
  },
  {
    id: '10',
    sellerId: '1',
    name: 'Silk Scarf',
    description: '100% pure silk with elegant print. Lightweight and versatile accessory.',
    price: 45.99,
    compareAtPrice: 59.99,
    images: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa33?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop'
    ],
    category: 'Fashion',
    tags: ['scarf', 'accessories', 'silk'],
    inventory: 55,
    sku: 'SS-010',
    weight: 0.1,
    rating: 4.5,
    reviewCount: 34,
    soldCount: 156,
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: '11',
    sellerId: '2',
    name: 'Wireless Earbuds',
    description: 'True wireless with active noise cancellation. 8-hour playback with charging case.',
    price: 79.99,
    compareAtPrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop'
    ],
    category: 'Electronics',
    tags: ['earbuds', 'audio', 'wireless', 'bluetooth'],
    inventory: 70,
    sku: 'WE-011',
    weight: 0.05,
    rating: 4.4,
    reviewCount: 189,
    soldCount: 734,
    isActive: true,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-03-14')
  },
  {
    id: '12',
    sellerId: '3',
    name: 'Scented Candle Set',
    description: 'Natural soy candles in glass jars. Set of 3 relaxing scents for your home.',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1602825389660-3f9749873e20?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=800&fit=crop'
    ],
    category: 'Home & Living',
    tags: ['candle', 'home', 'decor', 'scent'],
    inventory: 40,
    sku: 'SC-012',
    weight: 0.8,
    rating: 4.8,
    reviewCount: 67,
    soldCount: 289,
    isActive: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-03-01')
  }
];

// Mock Reviews
const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '10',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    title: 'Absolutely love this bag!',
    comment: 'The quality is amazing and it looks even better in person. Highly recommend!',
    helpful: 23,
    verified: true,
    createdAt: new Date('2024-02-15')
  },
  {
    id: '2',
    productId: '1',
    userId: '11',
    userName: 'Michael Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 4,
    title: 'Great quality, slightly heavy',
    comment: 'Beautiful bag but a bit heavier than expected. Still very happy with the purchase.',
    helpful: 15,
    verified: true,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    productId: '2',
    userId: '12',
    userName: 'Emma Davis',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    title: 'Best headphones I\'ve owned',
    comment: 'The noise cancellation is incredible. Perfect for working from home.',
    helpful: 45,
    verified: true,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '4',
    productId: '3',
    userId: '13',
    userName: 'James Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 5,
    title: 'Amazing smartwatch!',
    comment: 'Battery life is excellent and the fitness tracking is very accurate.',
    helpful: 32,
    verified: true,
    createdAt: new Date('2024-03-01')
  }
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  categories: mockCategories,
  reviews: mockReviews,
  featuredProducts: mockProducts.slice(0, 8),
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ isLoading: false });
  },

  fetchProductById: (id: string) => {
    return get().products.find(p => p.id === id);
  },

  fetchReviews: (productId: string) => {
    return get().reviews.filter(r => r.productId === productId);
  },

  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: String(get().reviews.length + 1),
      createdAt: new Date()
    };
    set(state => ({ reviews: [...state.reviews, newReview] }));
  },

  searchProducts: (query: string, filters?: SearchFilters) => {
    let results = get().products;
    
    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Category filter
    if (filters?.category) {
      const category = get().categories.find(c => c.id === filters.category);
      if (category) {
        results = results.filter(p => p.category === category.name);
      }
    }
    
    // Price filters
    if (filters?.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }
    
    // Rating filter
    if (filters?.rating) {
      results = results.filter(p => p.rating >= filters.rating!);
    }
    
    // In stock filter
    if (filters?.inStock) {
      results = results.filter(p => p.inventory > 0);
    }
    
    // Sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }
    
    return results;
  },

  getProductsByCategory: (categoryId: string) => {
    const category = get().categories.find(c => c.id === categoryId);
    if (!category) return [];
    return get().products.filter(p => p.category === category.name);
  },

  getProductsBySeller: (sellerId: string) => {
    return get().products.filter(p => p.sellerId === sellerId);
  },

  getRelatedProducts: (productId: string) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return [];
    
    return get().products
      .filter(p => p.id !== productId && (p.category === product.category || p.tags.some(t => product.tags.includes(t))))
      .slice(0, 4);
  },

  createProduct: async (product) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProduct: Product = {
      ...product,
      id: String(get().products.length + 1),
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({ products: [...state.products, newProduct] }));
    return newProduct;
  },

  updateProduct: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const productIndex = get().products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;
    
    const updatedProduct = {
      ...get().products[productIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    const newProducts = [...get().products];
    newProducts[productIndex] = updatedProduct;
    set({ products: newProducts });
    
    return updatedProduct;
  },

  deleteProduct: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = get().products.findIndex(p => p.id === id);
    if (productIndex === -1) return false;
    
    const newProducts = get().products.filter(p => p.id !== id);
    set({ products: newProducts });
    
    return true;
  }
}));
