import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, User, MapPin, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export function RegisterPage({ setActivePage }) {
  const { register, demoLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: 'Hassan, Karnataka',
    state: 'Karnataka'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      setActivePage('dashboard');
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  const handleDemoAccess = async () => {
    setIsLoading(true);
    const res = await demoLogin();
    setIsLoading(false);
    if (res.success) {
      setActivePage('dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="agri-card p-8 bg-white shadow-md border-soil-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-agri/10 text-agri flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Farmer Registration</h2>
          <p className="text-xs text-gray-500 mt-1">Set up your agricultural profile and primary farm plot</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Farmer Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
              />
              <User className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="farmer@krishimitra.agr"
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Password (min 6 characters) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Primary Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Hassan, Karnataka"
                className="w-full px-3.5 py-2 rounded-xl border border-soil-300 text-sm bg-[#faf9f7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450..."
                className="w-full px-3.5 py-2 rounded-xl border border-soil-300 text-sm bg-[#faf9f7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-agri hover:bg-agri-deep text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-70 mt-3"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-soil-200 text-center space-y-2">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => setActivePage('login')}
              className="text-agri font-bold hover:underline"
            >
              Log In
            </button>
          </p>

          <button
            onClick={handleDemoAccess}
            className="text-xs text-amber-800 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Or skip registration with 1-Click Demo Farmer
          </button>
        </div>
      </div>
    </div>
  );
}
