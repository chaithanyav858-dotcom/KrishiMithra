import React from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  CloudRain, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { WeatherProviderBadge } from '../common/StatusBadge';

export function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="agri-card p-6 bg-gradient-to-br from-white to-[#f4f9f4] border-soil-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soil-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{weather.location}</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Observed: {weather.observationTime ? new Date(weather.observationTime).toLocaleString() : 'Recent'}
          </p>
        </div>
        <WeatherProviderBadge 
          status={weather.providerStatus} 
          providerName={weather.providerName} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-center">
        {/* Main Temperature & Condition */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-skyacc-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
            <CloudSun className="w-12 h-12" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                {weather.temperature}°C
              </span>
              {weather.apparentTemperature != null && (
                <span className="text-sm font-medium text-gray-500">
                  Feels like {weather.apparentTemperature}°C
                </span>
              )}
            </div>
            <p className="text-base font-semibold text-agri-deep mt-1">
              {weather.conditionText || 'Fair Weather'}
            </p>
          </div>
        </div>

        {/* Microclimate Grid */}
        <div className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl border border-soil-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Relative Humidity</p>
              <p className="text-sm font-bold text-gray-900">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Wind Velocity</p>
              <p className="text-sm font-bold text-gray-900">{weather.windSpeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Rain Probability</p>
              <p className="text-sm font-bold text-gray-900">{weather.rainChance}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Precipitation</p>
              <p className="text-sm font-bold text-gray-900">{weather.precipitation} mm</p>
            </div>
          </div>
        </div>
      </div>

      {weather.fallbackNotice && (
        <div className="mt-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{weather.fallbackNotice}</span>
        </div>
      )}
    </div>
  );
}

export function ForecastList({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="agri-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-soil-100">
        <Calendar className="w-4 h-4 text-agri" />
        <h4 className="font-bold text-gray-900 text-sm">5-Day Meteorological Trend & Outlook</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {forecast.map((day, idx) => (
          <div 
            key={idx} 
            className="p-3.5 rounded-xl bg-[#faf9f6] border border-soil-200/90 text-center flex flex-col justify-between hover:border-agri-leaf transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-gray-900">{day.day}</p>
              <p className="text-[11px] text-gray-500">{day.date}</p>
            </div>

            <div className="my-3 flex flex-col items-center">
              <CloudSun className="w-7 h-7 text-sky-600 mb-1" />
              <p className="text-[11px] font-medium text-gray-700 line-clamp-1" title={day.condition}>
                {day.condition}
              </p>
            </div>

            <div className="pt-2 border-t border-soil-100 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">{day.maxTemp}°</span>
              <span className="text-gray-500">{day.minTemp}°</span>
              <span className={`font-semibold text-[11px] ${day.rainChance > 40 ? 'text-blue-600' : 'text-gray-400'}`}>
                {day.rainChance}% 🌧
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgriWeatherAlerts({ interpretation }) {
  if (!interpretation) return null;

  const { sprayingAssessment, diseaseRisk, heatStress, advisories, disclaimer } = interpretation;

  return (
    <div className="agri-card p-6 mt-6 border-agri/30 bg-[#fbfdfa]">
      <div className="flex items-center justify-between pb-3 border-b border-agri-mist">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-agri animate-ping"></div>
          <h4 className="font-bold text-agri-deep text-base">Agricultural Weather Interpretation</h4>
        </div>
        <span className="text-xs text-agri-deep font-semibold bg-agri-mist px-2.5 py-0.5 rounded-full">
          Agronomic Guidance (Separate from Raw Data)
        </span>
      </div>

      <p className="text-xs text-gray-600 mt-2 mb-4">
        Synthesized field implications derived from microclimate factors to assist crop protection and resource timing.
      </p>

      {/* Spraying & Field Operations Banner */}
      <div className="p-4 rounded-xl bg-white border border-soil-200 mb-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Foliar Agrochemical Spray Window</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                sprayingAssessment.suitability === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                sprayingAssessment.suitability === 'Risky' ? 'bg-amber-100 text-amber-800' :
                sprayingAssessment.suitability === 'Unfavorable' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {sprayingAssessment.suitability}
              </span>
            </div>
            <p className="text-xs text-gray-700 mt-1 leading-relaxed">
              {sprayingAssessment.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Specific Advisories */}
      <div className="space-y-3">
        {advisories?.map((adv, idx) => (
          <div 
            key={idx}
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              adv.severity === 'warning' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
              adv.severity === 'success' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' :
              'bg-sky-50/70 border-sky-200 text-sky-900'
            }`}
          >
            {adv.severity === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> :
             adv.severity === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> :
             <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-bold leading-tight">{adv.title}</p>
              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{adv.message}</p>
            </div>
          </div>
        ))}
      </div>

      {disclaimer && (
        <p className="text-[11px] text-gray-400 mt-4 italic">
          * {disclaimer}
        </p>
      )}
    </div>
  );
}
