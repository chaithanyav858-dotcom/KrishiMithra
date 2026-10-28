import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export function LoginPage({ setActivePage }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await login({ email, password });
    setIsLoading(false);

    if (res.success) {
      setActivePage('dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid credentials');
    }
  };

  const handleDemoAccess = async () => {
    setErrorMessage('');
    setIsLoading(true);
    const res = await demoLogin();
    setIsLoading(false);

    if (res.success) {
      setActivePage('dashboard');
    } else {
      setErrorMessage(res.error || 'Failed to start demo session');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="agri-card p-8 bg-white shadow-md border-soil-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-agri/10 text-agri flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Farmer Sign In</h2>
          <p className="text-xs text-gray-500 mt-1">Access your farm profile and saved agricultural consultations</p>
        </div>

        {/* 1-Click Demo Evaluation Button */}
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-300">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              MCE Evaluator Quick Access
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mb-2 leading-relaxed">
            Test the complete system as pre-seeded demo farmer <strong>Ramesh Patil (Hassan)</strong> with historical crop and irrigation records.
          </p>
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-soil-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Log In as Demo Farmer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-soil-200"></div></div>
          <span className="relative bg-white px-3 text-xs text-gray-400 font-medium">Or enter your credentials</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-agri hover:bg-agri-deep text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-70 mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <span>New to KrishiMitra? </span>
          <button
            onClick={() => setActivePage('register')}
            className="text-agri font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
