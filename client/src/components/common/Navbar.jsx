import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, 
  LayoutDashboard, 
  Wheat, 
  CloudSun, 
  Droplets, 
  History, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  MapPin
} from 'lucide-react';

export function Navbar({ activePage, setActivePage }) {
  const { user, isAuthenticated, logout, demoLogin, isDemoAccount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
    { id: 'recommendation', label: 'Crop Advisory', icon: Wheat, protected: false },
    { id: 'weather', label: 'Weather & Forecast', icon: CloudSun, protected: false },
    { id: 'irrigation', label: 'Irrigation Plan', icon: Droplets, protected: false },
    { id: 'history', label: 'History', icon: History, protected: true },
    { id: 'profile', label: 'My Farm & Profile', icon: User, protected: true },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  const handleDemoAccess = async () => {
    const res = await demoLogin();
    if (res.success) {
      setActivePage('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-soil-200/80 shadow-xs">
      {/* MCE Department Header Banner */}
      <div className="bg-agri-deep text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-agri-leaf/30 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider text-agri-mist">
            MCE HASSAN
          </span>
          <span className="truncate">Department of Computer Science & Engineering • 5th Sem Mini Project</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-agri-mist">
          <span>Smart Farming AI</span>
          <span>•</span>
          <span>Open-Meteo Integration</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-agri flex items-center justify-center text-white shadow-sm group-hover:bg-agri-deep transition-colors">
              <Sprout className="w-6 h-6 text-agri-mist" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-agri-deep">Krishi<span className="text-agri">Mitra</span></span>
                {isDemoAccount && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Smart Agricultural Decision Support</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // If route is protected and user is not authenticated, hide or prompt
              if (item.protected && !isAuthenticated) return null;

              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-agri-mist/70 text-agri-deep font-semibold'
                      : 'text-gray-600 hover:text-agri hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section: Auth buttons / User Badge */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f8f6f0] border border-soil-200 cursor-pointer hover:border-agri-leaf transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-agri/10 text-agri flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'F'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-gray-900 leading-tight">{user?.name}</p>
                    <p className="text-gray-500 text-[11px] flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {user?.location || 'Hassan'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDemoAccess}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>1-Click Demo Farmer</span>
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-agri hover:bg-gray-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-agri hover:bg-agri-deep transition-colors shadow-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={handleDemoAccess}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-soil-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {isAuthenticated && (
            <div className="px-3 py-2 mb-2 bg-[#faf8f5] rounded-lg border border-soil-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-gray-900">{user?.name}</p>
                <p className="text-[11px] text-gray-500">{user?.location}</p>
              </div>
              <button
                onClick={logout}
                className="text-xs text-red-600 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activePage === 'landing' ? 'bg-agri-mist text-agri-deep font-semibold' : 'text-gray-700'}`}
          >
            Home / Introduction
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.protected && !isAuthenticated) return null;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  isActive ? 'bg-agri-mist text-agri-deep font-semibold' : 'text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 text-agri" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-soil-200 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2 text-center text-sm font-medium rounded-lg border border-soil-300 text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-agri text-white hover:bg-agri-deep"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
