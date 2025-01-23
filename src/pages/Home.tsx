import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Headphones,
  Star,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';

// Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(242, 122, 42, 0.2)';
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(242, 122, 42, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
}

import { useState } from 'react';

// Product Card Component
function ProductCard({ product, index }: { product: any; index: number }) {
  const { addToCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 80}ms`
      }}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.compareAtPrice && (
              <Badge className="bg-red-500 text-white">
                Sale
              </Badge>
            )}
            {product.inventory < 10 && (
              <Badge className="bg-amber-500 text-white">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-white text-[#1a1a1a] hover:bg-[#f27a2a] hover:text-white transition-colors"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-[#666666] uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-[#f27a2a] transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
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

          {/* Price */}
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

// Category Card Component
function CategoryCard({ category, index }: { category: any; index: number }) {
  return (
    <Link 
      to={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <h3 className="text-xl font-bold mb-1 transition-all duration-300 group-hover:tracking-wider">
          {category.name}
        </h3>
        <p className="text-sm text-white/80 mb-2">{category.productCount} Products</p>
        <span className="text-sm font-medium text-[#f27a2a] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-1">
          Shop Now <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-[#444444] mb-6 italic">"{testimonial.text}"</p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-[#1a1a1a]">{testimonial.name}</p>
          <p className="text-sm text-[#666666]">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { featuredProducts, categories } = useProductStore();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $50'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description: '100% secure payment methods'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round the clock customer support'
    }
  ];

  const testimonials = [
    {
      text: "Amazing quality products and fast shipping! Will definitely shop here again. The customer service is outstanding.",
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      text: "The customer service is outstanding. They helped me find exactly what I needed. Highly recommend this marketplace!",
      name: "Michael Chen",
      role: "Tech Enthusiast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      text: "Best online shopping experience I've had. Great prices, excellent selection, and super fast delivery.",
      name: "Emma Davis",
      role: "Interior Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-white via-white to-[#fff5ef] overflow-hidden">
        <ParticleBackground />
        
        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-[#f27a2a]/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-[#f27a2a]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#f27a2a]/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  <span className="block animate-in slide-in-from-bottom-4 duration-700">Discover</span>
                  <span className="block animate-in slide-in-from-bottom-4 duration-700 delay-150 text-[#f27a2a]">Amazing</span>
                  <span className="block animate-in slide-in-from-bottom-4 duration-700 delay-300">Products</span>
                </h1>
                <p className="text-lg text-[#666666] max-w-lg animate-in slide-in-from-bottom-4 duration-700 delay-500">
                  Explore our curated collection of premium items from top brands and verified sellers around the world.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-700">
                <Link to="/shop">
                  <Button 
                    size="lg" 
                    className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-[#f27a2a]/30 hover:shadow-xl hover:shadow-[#f27a2a]/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
                    >
                      Become a Seller
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-1000">
                <div>
                  <p className="text-3xl font-bold text-[#1a1a1a]">
                    <AnimatedCounter end={10} suffix="K+" />
                  </p>
                  <p className="text-sm text-[#666666]">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a1a1a]">
                    <AnimatedCounter end={50} suffix="+" />
                  </p>
                  <p className="text-sm text-[#666666]">Brands</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a1a1a]">Fast</p>
                  <p className="text-sm text-[#666666]">Shipping</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-in slide-in-from-right-20 duration-1000">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=1000&fit=crop"
                  alt="Hero"
                  className="rounded-2xl shadow-2xl w-full object-cover"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a1a]">Verified Sellers</p>
                      <p className="text-sm text-[#666666]">100% Trustworthy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    transform: index === 1 ? 'translateY(-10px)' : undefined
                  }}
                >
                  <div className="w-16 h-16 bg-[#f27a2a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#f27a2a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{feature.title}</h3>
                  <p className="text-[#666666]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 
                className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Featured Products
              </h2>
              <p className="text-[#666666]">Handpicked items just for you</p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Shop by Category
            </h2>
            <p className="text-[#666666] max-w-2xl mx-auto">
              Browse our wide selection of products across different categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              What Our Customers Say
            </h2>
            <p className="text-[#666666]">Real reviews from real customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="animate-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f27a2a] to-[#ff9a5a]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/90 mb-8">
              Get the latest updates on new products, sales, and exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <Button 
                type="submit"
                className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-4 rounded-full transition-colors"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
