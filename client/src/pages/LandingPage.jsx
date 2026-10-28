import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Wheat, 
  CloudSun, 
  Droplets, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  MapPin,
  TrendingUp,
  Cpu
} from 'lucide-react';

export function LandingPage({ setActivePage }) {
  const { isAuthenticated, demoLogin } = useAuth();

  const handleDemoStart = async () => {
    const res = await demoLogin();
    if (res.success) {
      setActivePage('dashboard');
    }
  };

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-agri-deep via-agri to-[#144733] text-white p-8 md:p-16 shadow-lg border border-agri-leaf/20">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-agri-leaf/20 border border-agri-leaf/40 text-xs font-semibold text-agri-mist">
            <Sparkles className="w-3.5 h-3.5 text-agri-mint" />
            <span>5th Sem CSE Mini Project • Malnad College of Engineering, Hassan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Smart farming decisions powered by <span className="text-agri-mint underline decoration-agri-leaf/50">AI & real-time weather</span> insights.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 font-normal leading-relaxed max-w-2xl">
            KrishiMitra bridges agronomic science and practical farm management. Enter your soil health card details, 
            receive data-backed crop suggestions, inspect live weather, and prevent water wastage with honest, explainable advisory.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {isAuthenticated ? (
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-8 py-3.5 rounded-xl bg-white text-agri-deep font-bold text-sm hover:bg-agri-mist transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Go to Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4 text-agri" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleDemoStart}
                  className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-soil-900 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-soil-900" />
                  <span>Explore 1-Click Demo as Ramesh Patil</span>
                </button>

                <button
                  onClick={() => setActivePage('register')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Register Free Account</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActivePage('recommendation')}
              className="px-5 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-emerald-200 hover:text-white text-xs font-semibold text-center transition-colors"
            >
              Test Crop Engine Directly →
            </button>
          </div>

          {/* Honest Metric Assurance */}
          <div className="pt-4 flex items-center gap-2 text-xs text-agri-mist/80">
            <ShieldCheck className="w-4 h-4 text-agri-mint shrink-0" />
            <span>Honest AI architecture: No falsified confidence percentages. Clearly labelled demo & live prediction services.</span>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-12 -bottom-16 opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-white" />
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Three Integrated Agricultural Decision Modules
          </h2>
          <p className="text-sm text-gray-500">
            Engineered to guide farmers through every crucial pre-sowing and in-season irrigation choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Crop Recommendation */}
          <div 
            onClick={() => setActivePage('recommendation')}
            className="agri-card p-6 cursor-pointer hover:border-agri hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-agri flex items-center justify-center mb-5 group-hover:bg-agri group-hover:text-white transition-colors">
                <Wheat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-agri transition-colors">
                1. Crop Recommendation
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Matches your soil type, season, and Nitrogen (N), Phosphorus (P), and Potassium (K) levels with agronomic matrices to recommend high-yielding crops.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-soil-100 flex items-center text-xs font-bold text-agri group-hover:translate-x-1 transition-transform">
              <span>Configure Soil Test Inputs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>

          {/* Card 2: Live Weather */}
          <div 
            onClick={() => setActivePage('weather')}
            className="agri-card p-6 cursor-pointer hover:border-agri hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
                2. Live Weather & Forecast
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Fetches real-time temperature, humidity, wind, and 5-day forecasts via Open-Meteo, with agricultural interpretation for spraying windows and disease risk.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-soil-100 flex items-center text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
              <span>View Hassan & Regional Forecast</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>

          {/* Card 3: Irrigation Advice */}
          <div 
            onClick={() => setActivePage('irrigation')}
            className="agri-card p-6 cursor-pointer hover:border-agri hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                3. Irrigation Advisory
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Combines crop water requirements, soil drainage dynamics, and incoming rain forecasts to prevent unnecessary irrigation and nutrient leaching.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-soil-100 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>Get Irrigation Plan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-soil-200">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agri">
            End-To-End Decision Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            How KrishiMitra Works for the Farmer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-soil-200/80">
            <div className="w-8 h-8 rounded-full bg-agri text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Enter Farm & Soil Data</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Input soil type (Red, Loamy, Black), cropping season, and NPK values from your soil health test.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-soil-200/80">
            <div className="w-8 h-8 rounded-full bg-agri text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Generate AI Recommendation</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              The prediction service evaluates agronomic compatibility and returns the optimal crop with explanations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-soil-200/80">
            <div className="w-8 h-8 rounded-full bg-agri text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Check Weather & Forecast</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Inspect current temperature, humidity, and 5-day rain probabilities for your district.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-soil-200/80">
            <div className="w-8 h-8 rounded-full bg-agri text-white font-bold text-xs flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Irrigate & Save History</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Receive practical irrigation instructions (e.g. "Delay irrigation") and persist the complete record for future review.
            </p>
          </div>
        </div>
      </section>

      {/* College Project Academic Information Card */}
      <section className="agri-card p-8 bg-[#fdfcfa] border-agri/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-agri"></span>
            <span className="text-xs font-bold text-agri uppercase tracking-wider">Academic Credentials</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Department of Computer Science & Engineering
          </h3>
          <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
            Developed by 5th-semester engineering students at Malnad College of Engineering (MCE), Hassan. 
            This project showcases full-stack web engineering, honest AI/ML system architecture, SQLite relational modeling, 
            and meteorological API integrations tailored for Karnataka agricultural conditions.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-6 py-3 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold transition-colors shadow-xs text-center"
          >
            Launch Farmer Portal
          </button>
          <button
            onClick={handleDemoStart}
            className="px-6 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-colors text-center"
          >
            Explore Preloaded Demo History
          </button>
        </div>
      </section>
    </div>
  );
}
