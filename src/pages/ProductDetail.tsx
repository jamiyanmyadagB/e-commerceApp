import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

// Review Card Component
function ReviewCard({ review }: { review: any }) {
  return (
    <div className="border-b border-[#e5e5e5] pb-6 mb-6 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-[#1a1a1a]">{review.userName}</p>
            <p className="text-xs text-[#666666]">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {review.verified && (
          <Badge variant="secondary" className="text-green-600 bg-green-50">
            Verified Purchase
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <h4 className="font-medium text-[#1a1a1a] mb-2">{review.title}</h4>
      <p className="text-[#666666]">{review.comment}</p>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProductById, fetchReviews, getRelatedProducts, addReview } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (id) {
      const prod = fetchProductById(id);
      if (prod) {
        setProduct(prod);
        setReviews(fetchReviews(id));
        setRelatedProducts(getRelatedProducts(id));
      } else {
        navigate('/shop');
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="animate-pulse text-[#666666]">Loading...</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }
    
    addReview({
      productId: product.id,
      userId: user?.id || '',
      userName: user?.name || '',
      userAvatar: user?.avatar,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      helpful: 0,
      verified: true
    });
    
    toast.success('Review submitted successfully!');
    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
    
    // Refresh reviews
    setReviews(fetchReviews(product.id));
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#666666] mb-6">
          <Link to="/" className="hover:text-[#f27a2a]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-[#f27a2a]">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-[#f27a2a]">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1a1a1a]">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                  -{discount}%
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-[#f27a2a]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#666666] uppercase tracking-wide mb-2">{product.category}</p>
              <h1 
                className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#666666]">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-[#f27a2a]">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-[#999999] line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-[#444444] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Truck className="w-4 h-4 text-[#f27a2a]" />
                  Free shipping over $50
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <ShieldCheck className="w-4 h-4 text-[#f27a2a]" />
                  Secure payment
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <RotateCcw className="w-4 h-4 text-[#f27a2a]" />
                  30-day returns
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="p-3 hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                  onClick={handleAddToCart}
                  disabled={product.inventory === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </Button>

                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Stock Status */}
              <p className={`text-sm ${product.inventory > 10 ? 'text-green-600' : product.inventory > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {product.inventory > 10 
                  ? `✓ In Stock (${product.inventory} available)` 
                  : product.inventory > 0 
                    ? `⚠ Only ${product.inventory} left in stock` 
                    : '✗ Out of Stock'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f27a2a] data-[state=active]:bg-transparent py-4 px-6"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f27a2a] data-[state=active]:bg-transparent py-4 px-6"
            >
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f27a2a] data-[state=active]:bg-transparent py-4 px-6"
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">Product Details</h3>
              <p className="text-[#444444] leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[#1a1a1a] mb-3">Specifications</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-[#666666]">SKU</td>
                        <td className="py-2 text-[#1a1a1a]">{product.sku}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-[#666666]">Category</td>
                        <td className="py-2 text-[#1a1a1a]">{product.category}</td>
                      </tr>
                      {product.weight && (
                        <tr className="border-b">
                          <td className="py-2 text-[#666666]">Weight</td>
                          <td className="py-2 text-[#1a1a1a]">{product.weight} kg</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-medium text-[#1a1a1a] mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">Customer Reviews</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-[#666666]">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl p-6 sticky top-24">
                  <h4 className="font-semibold text-[#1a1a1a] mb-4">Write a Review</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#666666] mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#666666] mb-2">Title</label>
                      <Input
                        value={reviewTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#666666] mb-2">Review</label>
                      <Textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this product"
                        rows={4}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? 'Submit Review' : 'Login to Review'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">Shipping Information</h3>
              <div className="space-y-4 text-[#444444]">
                <p>We offer the following shipping options:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Standard Shipping (5-7 business days) - FREE on orders over $50</li>
                  <li>Express Shipping (2-3 business days) - $9.99</li>
                  <li>Next Day Delivery - $19.99</li>
                </ul>
                
                <h4 className="font-semibold text-[#1a1a1a] mt-6 mb-2">Return Policy</h4>
                <p>We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 
              className="text-2xl font-bold text-[#1a1a1a] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <Link key={prod.id} to={`/product/${prod.id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-[#f9f9f9]">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#1a1a1a] line-clamp-1 group-hover:text-[#f27a2a] transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-[#f27a2a] font-bold mt-1">
                        ${prod.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
