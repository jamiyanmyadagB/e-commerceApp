import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error('Invalid email or password');
    }
  };

  const demoAccounts = [
    { label: 'Customer', email: 'customer@example.com', password: 'password' },
    { label: 'Seller', email: 'seller@example.com', password: 'password' },
    { label: 'Admin', email: 'admin@example.com', password: 'password' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] via-white to-[#fff5ef] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-[#f27a2a] rounded-xl flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
              MarketPlace
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#1a1a1a]">
            Welcome back
          </h2>
          <p className="mt-2 text-[#666666]">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1a1a1a]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link to="#" className="text-sm text-[#f27a2a] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white py-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#666666]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#f27a2a] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8">
          <p className="text-center text-sm text-[#666666] mb-4">Demo Accounts (click to auto-fill)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="px-4 py-2 bg-white rounded-full text-sm text-[#444444] hover:bg-[#f27a2a] hover:text-white transition-colors shadow-sm"
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
