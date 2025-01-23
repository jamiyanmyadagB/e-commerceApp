import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star,
  Grid3X3,
  List,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Product Card Component
function ProductCard({ product, viewMode }: { product: any; viewMode: 'grid' | 'list' }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
          <div className="relative sm:w-48 aspect-square overflow-hidden bg-[#f9f9f9]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.compareAtPrice && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                Sale
              </Badge>
            )}
          </div>
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-2 group-hover:text-[#f27a2a] transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-[#666666] line-clamp-2 mb-3">
                {product.description}
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-[#666666]">({product.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#f27a2a]">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-[#999999] line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.compareAtPrice && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              Sale
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full bg-white text-[#1a1a1a] hover:bg-[#f27a2a] hover:text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-[#666666] uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-[#f27a2a] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-[#666666]">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#f27a2a]">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-[#999999] line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, searchProducts } = useProductStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = searchProducts(searchQuery, {
    category: selectedCategory,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    rating: selectedRating || undefined,
    sortBy: sortBy as any,
    inStock: true
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setSelectedRating(0);
    setSortBy('relevance');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 500 || selectedRating > 0;

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Shop All Products
          </h1>
          
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <form onSubmit={handleSearch} className="relative w-full sm:w-96">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            </form>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile Filters Content */}
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedCategory === cat.id}
                              onCheckedChange={() => setSelectedCategory(
                                selectedCategory === cat.id ? '' : cat.id
                              )}
                            />
                            <span className="text-sm text-[#444444]">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-3">Price Range</h4>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={500}
                        step={10}
                      />
                      <div className="flex justify-between mt-2 text-sm text-[#666666]">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-3">Rating</h4>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                          <label key={rating} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedRating === rating}
                              onCheckedChange={() => setSelectedRating(
                                selectedRating === rating ? 0 : rating
                              )}
                            />
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-[#666666] ml-1">& Up</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#f27a2a] text-white' : 'bg-white text-[#666666]'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#f27a2a] text-white' : 'bg-white text-[#666666]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-[#666666]">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 500) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ${priceRange[0]} - ${priceRange[1]}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 500])} />
                </Badge>
              )}
              {selectedRating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedRating}+ Stars
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRating(0)} />
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-[#f27a2a] hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1a1a1a]">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#f27a2a] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-[#1a1a1a] mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-[#f27a2a] transition-colors">
                      <Checkbox
                        checked={selectedCategory === cat.id}
                        onCheckedChange={() => setSelectedCategory(
                          selectedCategory === cat.id ? '' : cat.id
                        )}
                      />
                      <span className="text-sm text-[#444444]">{cat.name}</span>
                      <span className="text-xs text-[#999999] ml-auto">({cat.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-[#1a1a1a] mb-3">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={500}
                  step={10}
                />
                <div className="flex justify-between mt-2 text-sm text-[#666666]">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedRating === rating}
                        onCheckedChange={() => setSelectedRating(
                          selectedRating === rating ? 0 : rating
                        )}
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-[#666666] ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[#666666]">
                Showing <span className="font-medium text-[#1a1a1a]">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#999999]" />
                </div>
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">No products found</h3>
                <p className="text-[#666666] mb-4">Try adjusting your search or filters</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
