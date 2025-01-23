import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Checkbox removed - not used
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock,
  ChevronLeft,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getCartTotal, discountAmount } = useCartStore();
  const { createOrder } = useOrderStore();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping] = useState(true);
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
  });

  const [billingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  void billingAddress;

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    const shipAddr = {
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
    };

    const billAddr = sameAsShipping ? shipAddr : {
      street: billingAddress.street,
      city: billingAddress.city,
      state: billingAddress.state,
      zipCode: billingAddress.zipCode,
      country: billingAddress.country,
    };

    const order = await createOrder(shipAddr, billAddr);
    
    if (order) {
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order.id}`);
    } else {
      toast.error('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const isShippingValid = () => {
    return (
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.email &&
      shippingAddress.street &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode
    );
  };

  const isPaymentValid = () => {
    return (
      paymentMethod.cardNumber.length >= 16 &&
      paymentMethod.cardName &&
      paymentMethod.expiryMonth &&
      paymentMethod.expiryYear &&
      paymentMethod.cvv.length >= 3
    );
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-[#666666] hover:text-[#f27a2a] transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </button>
          <h1 
            className="text-3xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Checkout
          </h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 'shipping' ? 'bg-[#f27a2a] text-white' : 'bg-green-500 text-white'
            }`}>
              {step === 'shipping' ? '1' : <Check className="w-5 h-5" />}
            </div>
            <span className={`ml-2 ${step === 'shipping' ? 'text-[#f27a2a]' : 'text-green-500'}`}>
              Shipping
            </span>
          </div>
          <div className="w-16 h-0.5 bg-[#e5e5e5] mx-4" />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 'payment' ? 'bg-[#f27a2a] text-white' : 
              step === 'review' ? 'bg-green-500 text-white' : 'bg-[#e5e5e5] text-[#666666]'
            }`}>
              {step === 'review' ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className={`ml-2 ${step === 'payment' ? 'text-[#f27a2a]' : step === 'review' ? 'text-green-500' : 'text-[#666666]'}`}>
              Payment
            </span>
          </div>
          <div className="w-16 h-0.5 bg-[#e5e5e5] mx-4" />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 'review' ? 'bg-[#f27a2a] text-white' : 'bg-[#e5e5e5] text-[#666666]'
            }`}>
              3
            </div>
            <span className={`ml-2 ${step === 'review' ? 'text-[#f27a2a]' : 'text-[#666666]'}`}>
              Review
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#f27a2a]" />
                  Shipping Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={shippingAddress.country}
                    onValueChange={(value) => setShippingAddress({ ...shippingAddress, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                  disabled={!isShippingValid()}
                >
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#f27a2a]" />
                  Payment Information
                </h2>

                <div className="mb-6">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentMethod.cardNumber}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                      className="pl-10"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="cardName">Cardholder Name *</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentMethod.cardName}
                    onChange={(e) => setPaymentMethod({ ...paymentMethod, cardName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="expiryMonth">Expiry Month *</Label>
                    <Select
                      value={paymentMethod.expiryMonth}
                      onValueChange={(value) => setPaymentMethod({ ...paymentMethod, expiryMonth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Expiry Year *</Label>
                    <Select
                      value={paymentMethod.expiryYear}
                      onValueChange={(value) => setPaymentMethod({ ...paymentMethod, expiryYear: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i} value={String(2024 + i)}>
                            {2024 + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentMethod.cvv}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                        className="pl-10"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep('shipping')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                    disabled={!isPaymentValid()}
                  >
                    Review Order
                  </Button>
                </div>
              </form>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#f27a2a]" />
                  Review Your Order
                </h2>

                {/* Shipping Summary */}
                <div className="mb-6 p-4 bg-[#f9f9f9] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#1a1a1a]">Shipping Address</h3>
                    <button 
                      onClick={() => setStep('shipping')}
                      className="text-sm text-[#f27a2a] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-[#666666]">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br />
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="mb-6 p-4 bg-[#f9f9f9] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#1a1a1a]">Payment Method</h3>
                    <button 
                      onClick={() => setStep('payment')}
                      className="text-sm text-[#f27a2a] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-[#666666]">
                    **** **** **** {paymentMethod.cardNumber.slice(-4)}<br />
                    {paymentMethod.cardName}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep('payment')}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Order Summary</h2>
              
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

              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <Lock className="w-4 h-4" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
