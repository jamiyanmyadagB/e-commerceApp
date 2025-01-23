// useEffect imported for future use
import { Link, useParams } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const { fetchOrderById } = useOrderStore();
  
  const order = orderId ? fetchOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Order not found</h2>
          <Link to="/orders">
            <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 
            className="text-3xl font-bold text-[#1a1a1a] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Order Confirmed!
          </h1>
          <p className="text-[#666666]">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-[#666666] mb-1">Order Number</p>
                <p className="font-semibold text-[#1a1a1a]">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666] mb-1">Date</p>
                <p className="font-semibold text-[#1a1a1a]">
                  {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#666666] mb-1">Total</p>
                <p className="font-semibold text-[#f27a2a]">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-[#1a1a1a] mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1a1a1a]">{item.name}</h4>
                      <p className="text-sm text-[#666666]">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium text-[#1a1a1a]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">Shipping Address</h3>
                  <p className="text-[#666666]">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">Payment Method</h3>
                  <p className="text-[#666666]">
                    Credit Card ending in ****
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#1a1a1a] mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f27a2a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#f27a2a]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a1a1a]">Order Confirmation Email</h4>
                  <p className="text-sm text-[#666666]">
                    We've sent a confirmation email to your inbox with all the details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f27a2a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#f27a2a]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a1a1a]">Order Processing</h4>
                  <p className="text-sm text-[#666666]">
                    Your order will be processed and prepared for shipment within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f27a2a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[#f27a2a]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a1a1a]">Shipping Updates</h4>
                  <p className="text-sm text-[#666666]">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="flex-1">
            <Button className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
              View My Orders
            </Button>
          </Link>
          <Link to="/shop" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
