import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight,
  Tag,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    couponCode, 
    discountAmount, 
    applyCoupon, 
    removeCoupon 
  } = useCartStore();
  const { products } = useProductStore();
  
  const [couponInput, setCouponInput] = useState('');

  const cartItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast.success('Coupon applied successfully!');
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-[#999999]" />
          </div>
          <h1 
            className="text-3xl font-bold text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Your Cart is Empty
          </h1>
          <p className="text-[#666666] mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/shop">
            <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          className="text-3xl font-bold text-[#1a1a1a] mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Shopping Cart ({cartItems.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.product?.images[0]}
                      alt={item.product?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="font-medium text-[#1a1a1a] hover:text-[#f27a2a] transition-colors line-clamp-1">
                        {item.product?.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#666666] mb-2">{item.product?.category}</p>
                    <p className="text-[#f27a2a] font-bold">
                      ${item.product?.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="p-2 text-[#999999] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="p-2 hover:bg-[#f9f9f9] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="p-2 hover:bg-[#f9f9f9] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-[#666666]">Subtotal</span>
                  <span className="font-bold text-[#1a1a1a]">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            <Link to="/shop">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                {!couponCode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">{couponCode}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#666666]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-[#1a1a1a]">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {subtotal < 50 && (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Button 
                className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white py-6"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="mt-4 text-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" 
                  alt="Visa" 
                  className="h-6 inline-block mx-1 opacity-50"
                />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" 
                  alt="Mastercard" 
                  className="h-6 inline-block mx-1 opacity-50"
                />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" 
                  alt="PayPal" 
                  className="h-6 inline-block mx-1 opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
