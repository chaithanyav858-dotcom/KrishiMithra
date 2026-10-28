import React from 'react';
import { Sprout, ShieldCheck, BookOpen, MapPin } from 'lucide-react';

export function Footer({ setActivePage }) {
  return (
    <footer className="bg-soil-900 text-stone-200 text-sm mt-16 border-t border-soil-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Project Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-leaf flex items-center justify-center text-soil-900">
                <Sprout className="w-5 h-5 font-bold" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Krishi<span className="text-agri-mint">Mitra</span></span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              A responsive smart agricultural decision-support web application empowering farmers with 
              soil-matched crop recommendations, real-time meteorological forecasting, and data-driven irrigation advice.
            </p>
            <div className="flex items-center gap-2 text-xs text-agri-mint pt-2">
              <ShieldCheck className="w-4 h-4 text-agri-leaf" />
              <span>Transparent AI metrics & honest data provenance (No fabricated confidence)</span>
            </div>
          </div>

          {/* Column 2: Academic Affiliation */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-agri-leaf" />
              Academic Project
            </h4>
            <p className="text-xs text-stone-300 font-medium">5th-Semester Mini Project</p>
            <p className="text-xs text-stone-400">Department of Computer Science & Engineering</p>
            <p className="text-xs text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-agri-mint inline" />
              Malnad College of Engineering (MCE)
            </p>
            <p className="text-xs text-stone-400">Hassan - 573202, Karnataka, India</p>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Core Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button onClick={() => setActivePage('recommendation')} className="hover:text-agri-mint transition-colors">
                  Crop Recommendation Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('weather')} className="hover:text-agri-mint transition-colors">
                  Open-Meteo Weather & Forecast
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('irrigation')} className="hover:text-agri-mint transition-colors">
                  Agro-Hydrological Irrigation Advisory
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-agri-mint transition-colors">
                  Consultation Snapshot History
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-soil-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} KrishiMitra. Developed for MCE CS&E Academic Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="bg-soil-800 text-stone-300 px-2.5 py-1 rounded text-[11px] font-mono">
              React 18 + Node 24 + SQLite + Open-Meteo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
