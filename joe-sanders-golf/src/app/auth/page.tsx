'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn('auth0', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Authentication error:', result.error);
        // Handle error (could add error state here)
      } else if (result?.url) {
        router.push(result.url);
      } else {
        // Successful sign in, redirect to home or intended page
        router.push('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-joe-black via-joe-stone to-joe-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-joe-gold hover:text-amber-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="w-16 h-16 bg-joe-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-joe-black" />
          </div>

          <h1 className="text-3xl font-joe-heading font-bold text-joe-gold mb-2">
            {isSignUp ? 'Join Uncle Joe\'s Golf Family' : 'Welcome Back'}
          </h1>
          <p className="text-joe-white/70">
            {isSignUp
              ? 'Create your account to start improving your golf game'
              : 'Sign in to continue your golf journey'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-joe-black/50 backdrop-blur-sm rounded-2xl p-8 border border-joe-gold/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-joe-white/80 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg px-4 py-3 text-white placeholder-joe-white/50 focus:border-joe-gold focus:outline-none focus:ring-2 focus:ring-joe-gold/20"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-joe-white/80 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg px-4 py-3 text-white placeholder-joe-white/50 focus:border-joe-gold focus:outline-none focus:ring-2 focus:ring-joe-gold/20"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-joe-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-joe-white/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-joe-white/50 focus:border-joe-gold focus:outline-none focus:ring-2 focus:ring-joe-gold/20"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-joe-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-joe-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg pl-12 pr-12 py-3 text-white placeholder-joe-white/50 focus:border-joe-gold focus:outline-none focus:ring-2 focus:ring-joe-gold/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-joe-white/50 hover:text-joe-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-joe-white/80 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-joe-white/50" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-joe-white/50 focus:border-joe-gold focus:outline-none focus:ring-2 focus:ring-joe-gold/20"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-6 py-4 rounded-lg font-joe-heading font-bold text-lg hover:from-amber-400 hover:to-joe-gold transition-all duration-300 transform hover:scale-105"
            >
              {isSignUp ? 'Create Account & Start Demo' : 'Sign In & Continue'}
            </button>
          </form>

          {/* Toggle between sign in/sign up */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-joe-gold hover:text-amber-400 transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'Don\'t have an account? Sign up'
              }
            </button>
          </div>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-joe-gold/20">
            <p className="text-sm text-joe-white/70 text-center mb-4">
              Just want to try it out?
            </p>
            <Link
              href="/simulator?demo=true"
              className="block w-full border-2 border-joe-gold text-joe-gold px-6 py-3 rounded-lg font-semibold text-center hover:bg-joe-gold hover:text-joe-black transition-all duration-300"
            >
              Try Free Demo (No Sign-up Required)
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-joe-white/50">
            By signing up, you agree to our{' '}
            <Link href="/terms-of-service" className="text-joe-gold hover:text-amber-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-joe-gold hover:text-amber-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}