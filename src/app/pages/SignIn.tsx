import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      toast.success('Successfully signed in!');
      navigate('/');
    } else {
      setError(result.error || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left side — Kelowna photo */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1578945761766-a4bc916e0dc7?w=1200&q=80"
          alt="Kelowna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/60 flex flex-col items-center justify-center text-white p-12">
          <Calendar className="h-16 w-16 mb-6 text-blue-300" />
          <h1 className="text-4xl font-bold mb-4 text-center">Kelowna Events</h1>
          <p className="text-lg text-blue-100 text-center">
            Discover and connect with your community through amazing local events.
          </p>
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Calendar className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Kelowna Events</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500">Sign up</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}