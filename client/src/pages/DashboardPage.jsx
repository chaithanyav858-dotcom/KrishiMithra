import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFlow } from '../context/FlowContext';
import { weatherApi, historyApi } from '../api/agriApi';
import { 
  Sprout, 
  Wheat, 
  CloudSun, 
  Droplets, 
  History, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Calendar,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  Layers,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { ModelBadge, IrrigationStatusBadge, WeatherProviderBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/UiFeedback';

export function DashboardPage({ setActivePage, onOpenHistoryDetail }) {
  const { user, isDemoAccount } = useAuth();
  const { updateFormData } = useFlow();

  const [weatherSummary, setWeatherSummary] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setErrorNotice(null);

      try {
        const userLocation = user?.location || 'Hassan, Karnataka';
        
        // Fetch weather and history concurrently
        const [weatherRes, historyRes] = await Promise.allSettled([
          weatherApi.getWeather(userLocation),
          historyApi.getHistory()
        ]);

        if (weatherRes.status === 'fulfilled' && weatherRes.value?.success) {
          setWeatherSummary(weatherRes.value.data);
        } else {
          console.warn('Weather fetch fallback triggered on dashboard');
        }

        if (historyRes.status === 'fulfilled' && historyRes.value?.success) {
          setRecentRecords(historyRes.value.history || []);
        }
      } catch (err) {
        console.error('Dashboard data load error:', err);
        setErrorNotice('Some dashboard elements could not be refreshed. Cached data shown.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  const latestRecord = recentRecords.length > 0 ? recentRecords[0] : null;

  const handleStartRecommendation = () => {
    if (user?.location) {
      updateFormData({ location: user.location });
    }
    setActivePage('recommendation');
  };

  if (isLoading) {
    return <LoadingSpinner message="Preparing your agricultural dashboard..." />;
  }

  return (
    <div className="space-y-8 py-2">
      {/* Welcome & Primary Action Banner */}
      <div className="agri-card p-6 md:p-8 bg-gradient-to-r from-agri-deep via-agri to-[#245e45] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-mint bg-white/10 px-2.5 py-0.5 rounded-full">
              Farmer Dashboard
            </span>
            {isDemoAccount && (
              <span className="bg-amber-400 text-soil-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Demo Account (Ramesh Patil)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-agri-mint" />
            Registered Location: <strong>{user?.location || 'Hassan, Karnataka'}</strong>
          </p>
        </div>

        <button
          onClick={handleStartRecommendation}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-agri-mist text-agri-deep font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] shrink-0"
        >
          <Wheat className="w-4 h-4 text-agri" />
          <span>Get Crop Recommendation</span>
          <ArrowRight className="w-4 h-4 text-agri" />
        </button>
      </div>

      {errorNotice && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Main Grid: Weather Snapshot & Agronomic Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Summary Card (1/3 or 2/3) */}
        <div className="lg:col-span-2 agri-card p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-soil-100">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-base text-gray-900">Current Field Weather Snapshot</h3>
              </div>
              {weatherSummary && (
                <WeatherProviderBadge 
                  status={weatherSummary.providerStatus} 
                  providerName={weatherSummary.providerName} 
                />
              )}
            </div>

            {weatherSummary ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
                <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-soil-200">
                  <p className="text-[11px] text-gray-500 font-medium">Temperature</p>
                  <p className="text-xl font-black text-gray-900 mt-0.5">{weatherSummary.temperature}°C</p>
                  <p className="text-[10px] text-gray-400">Feels {weatherSummary.apparentTemperature}°C</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-soil-200">
                  <p className="text-[11px] text-gray-500 font-medium">Atmosphere</p>
                  <p className="text-sm font-bold text-gray-900 mt-1 line-clamp-1" title={weatherSummary.conditionText}>
                    {weatherSummary.conditionText}
                  </p>
                  <p className="text-[10px] text-gray-400">Condition</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-soil-200">
                  <p className="text-[11px] text-gray-500 font-medium">Humidity</p>
                  <p className="text-xl font-black text-gray-900 mt-0.5">{weatherSummary.humidity}%</p>
                  <p className="text-[10px] text-gray-400">Relative Humidity</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-soil-200">
                  <p className="text-[11px] text-gray-500 font-medium">Rain Chance</p>
                  <p className="text-xl font-black text-blue-600 mt-0.5">{weatherSummary.rainChance}%</p>
                  <p className="text-[10px] text-gray-400">Precip {weatherSummary.precipitation}mm</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-500">
                Weather conditions currently synchronizing...
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-soil-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Location: <strong>{weatherSummary?.location || user?.location}</strong>
            </span>
            <button
              onClick={() => setActivePage('weather')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 hover:underline"
            >
              <span>View 5-Day Forecast & Agro Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Useful Regional Agronomic Insight Card */}
        <div className="agri-card p-6 bg-[#fafdf9] border-agri-mist flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-agri-mist text-agri-deep">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base">Regional Farm Insight</h3>
            </div>

            <div className="mt-4 space-y-3 text-xs text-gray-700">
              <div className="p-3 rounded-xl bg-white border border-soil-200">
                <span className="font-bold text-agri-deep block text-xs mb-1">
                  Hassan & Southern Plateau Advisory
                </span>
                <p className="leading-relaxed">
                  Red sandy loam soils in the Hemavathi basin benefit from split Nitrogen application. 
                  Applying fertilizer in two split doses rather than all at basal prevents leaching during unseasonal showers.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-soil-200">
                <span className="font-bold text-blue-800 block text-xs mb-1">
                  Water Conservation Directive
                </span>
                <p className="leading-relaxed">
                  Always inspect the 48-hour rain probability before running canal or borewell pumps. 
                  Postponing irrigation ahead of predicted rain protects soil aeration and saves electricity.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-agri-mist text-[11px] text-gray-500 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-agri" />
            <span>ICAR & UAS Agronomic Guidelines</span>
          </div>
        </div>
      </div>

      {/* Latest Recommendation / Irrigation Summary */}
      {latestRecord && (
        <div className="agri-card p-6 bg-white border-soil-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-soil-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-agri">
                Most Recent Consultation
              </span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">
                {latestRecord.crop} Recommendation
              </h3>
              <p className="text-xs text-gray-500">
                Saved on {new Date(latestRecord.createdAt).toLocaleDateString()} for {latestRecord.farmName}
              </p>
            </div>
            <IrrigationStatusBadge status={latestRecord.irrigationStatus} />
          </div>

          <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#faf8f5] border border-soil-200">
              <span className="text-gray-500 block text-[11px]">Cultivation Profile</span>
              <p className="font-bold text-gray-900 capitalize mt-0.5">
                {latestRecord.soilType?.replace('_', ' ')} Soil • {latestRecord.season} Season
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#faf8f5] border border-soil-200">
              <span className="text-gray-500 block text-[11px]">Weather at Consultation</span>
              <p className="font-bold text-gray-900 mt-0.5">
                {latestRecord.weatherSummary || 'Standard regional climate'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#faf8f5] border border-soil-200">
              <span className="text-gray-500 block text-[11px]">Prediction Model</span>
              <p className="font-bold text-gray-900 mt-0.5">
                {latestRecord.modelName} ({latestRecord.modelStatus})
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 italic bg-[#fcfaf7] p-3 rounded-xl border border-soil-100">
            "{latestRecord.summaryExcerpt}"
          </p>

          <div className="mt-4 pt-3 border-t border-soil-100 flex items-center justify-end gap-3">
            <button
              onClick={() => onOpenHistoryDetail(latestRecord.id)}
              className="text-xs font-bold text-agri hover:text-agri-deep flex items-center gap-1"
            >
              <span>Inspect Full Historical Context</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActivePage('recommendation')}
          className="p-5 rounded-2xl bg-white border border-soil-200 hover:border-agri text-left transition-all group shadow-xs"
        >
          <Wheat className="w-6 h-6 text-agri mb-2" />
          <h4 className="font-bold text-sm text-gray-900 group-hover:text-agri">New Crop Recommendation</h4>
          <p className="text-xs text-gray-500 mt-1">Enter fresh soil test N-P-K readings to get tailored crop suggestions.</p>
        </button>

        <button
          onClick={() => setActivePage('irrigation')}
          className="p-5 rounded-2xl bg-white border border-soil-200 hover:border-blue-600 text-left transition-all group shadow-xs"
        >
          <Droplets className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600">Irrigation Plan</h4>
          <p className="text-xs text-gray-500 mt-1">Check today's watering directive based on soil moisture and rain forecast.</p>
        </button>

        <button
          onClick={() => setActivePage('history')}
          className="p-5 rounded-2xl bg-white border border-soil-200 hover:border-amber-600 text-left transition-all group shadow-xs"
        >
          <History className="w-6 h-6 text-amber-600 mb-2" />
          <h4 className="font-bold text-sm text-gray-900 group-hover:text-amber-600">Consultation History</h4>
          <p className="text-xs text-gray-500 mt-1">Review {recentRecords.length} saved past recommendations and weather snapshots.</p>
        </button>
      </div>
    </div>
  );
}
