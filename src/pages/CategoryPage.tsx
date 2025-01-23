import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Star,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

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

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products } = useProductStore();
  
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = category 
    ? products.filter(p => p.category === category.name)
    : [];

  if (!category) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Category not found</h2>
          <Link to="/shop">
            <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Category Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <nav className="flex items-center justify-center gap-2 text-sm mb-4">
              <Link to="/" className="hover:text-[#f27a2a]">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/shop" className="hover:text-[#f27a2a]">Shop</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{category.name}</span>
            </nav>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {category.name}
            </h1>
            <p className="text-white/80">{category.productCount} Products</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-[#666666] hover:text-[#f27a2a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <p className="text-[#666666]">
            Showing <span className="font-medium text-[#1a1a1a]">{categoryProducts.length}</span> products
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-[#999999]" />
            </div>
            <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">No products found</h3>
            <p className="text-[#666666] mb-4">This category doesn't have any products yet.</p>
            <Link to="/shop">
              <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                Browse All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
