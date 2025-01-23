import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Shield, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function BecomeSeller() {
  const navigate = useNavigate();
  const { becomeSeller, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeName || !formData.storeDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await becomeSeller({
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
    });
    
    if (success) {
      toast.success('Congratulations! You are now a seller!');
      navigate('/seller');
    } else {
      toast.error('Failed to create seller account');
    }
  };

  const benefits = [
    {
      icon: Store,
      title: 'Your Own Store',
      description: 'Create and customize your own storefront with your brand.',
    },
    {
      icon: TrendingUp,
      title: 'Reach Millions',
      description: 'Access our large customer base and grow your business.',
    },
    {
      icon: DollarSign,
      title: 'Low Commission',
      description: 'Competitive commission rates to maximize your profits.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Get paid securely and on time with our payment system.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Become a Seller
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Join thousands of successful sellers on MarketPlace and start growing your business today.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-[#f27a2a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-[#f27a2a]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#666666]">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Start Selling Today</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="My Awesome Store"
                  required
                />
              </div>

              <div>
                <Label htmlFor="storeDescription">Store Description *</Label>
                <Textarea
                  id="storeDescription"
                  value={formData.storeDescription}
                  onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                  placeholder="Tell us about your store and what you sell..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1" required />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-[#f27a2a] hover:underline">Seller Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-[#f27a2a] hover:underline">Commission Structure</a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white py-6"
                disabled={isLoading}
              >
                {isLoading ? 'Creating your store...' : 'Create My Store'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#1a1a1a] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'How much does it cost to sell?',
                a: 'It\'s free to create a seller account. We only charge a small commission on each sale.',
              },
              {
                q: 'How do I get paid?',
                a: 'Payments are processed securely and deposited to your bank account weekly.',
              },
              {
                q: 'What can I sell?',
                a: 'You can sell any legal products that comply with our policies.',
              },
              {
                q: 'How do I manage my store?',
                a: 'Use our intuitive seller dashboard to manage products, orders, and analytics.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{faq.q}</h3>
                <p className="text-[#666666]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
