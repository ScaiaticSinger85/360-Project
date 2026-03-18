import { PageType } from '../../App';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface SignInPageProps {
  onNavigate: (page: PageType) => void;
}

export function SignInPage({ onNavigate }: SignInPageProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Simple Header */}
      <div className="border-b-2 border-gray-300 bg-white p-4">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => onNavigate('home')} className="w-32 h-8 bg-blue-200 rounded flex items-center justify-center text-xs font-bold hover:bg-blue-300">
            LOGO
          </button>
        </div>
      </div>
    
      {/* Sign In Form */}
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-gray-300">
            <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2 focus-within:border-blue-500">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Enter your email</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2 focus-within:border-blue-500">
                <Lock size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Enter your password</span>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                <span>Remember me</span>
              </label>
              <button className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mb-4">
              Sign In
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button 
                onClick={() => onNavigate('sign-up')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Note:</strong> Sign in to create events, RSVP to events, and leave reviews.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
