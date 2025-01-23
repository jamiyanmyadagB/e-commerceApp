import { Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Wishlist() {
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  
  // Mock wishlist - in real app, this would come from a wishlist store
  const [wishlistItems, setWishlistItems] = useState<string[]>(['1', '2', '3']);

  const wishlistProducts = products.filter(p => wishlistItems.includes(p.id));

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(id => id !== productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
    toast.success('Added to cart!');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-[#999999]" />
          </div>
          <h1 
            className="text-3xl font-bold text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Your Wishlist is Empty
          </h1>
          <p className="text-[#666666] mb-8">
            Save items you love to your wishlist and revisit them anytime.
          </p>
          <Link to="/shop">
            <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white px-8">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 
            className="text-3xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            My Wishlist ({wishlistProducts.length})
          </h1>
          <Link to="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-[#f27a2a] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
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
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#f27a2a]">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
