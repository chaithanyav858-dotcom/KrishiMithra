import React from 'react';
import { ShieldCheck, Sparkles, CloudSun, AlertCircle, Clock, Droplets } from 'lucide-react';

export function ModelBadge({ status, modelName, confidence }) {
  const isDemo = status === 'demo' || modelName?.includes('demo');

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1 ${
        isDemo 
          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
      }`}>
        {isDemo ? <Sparkles className="w-3.5 h-3.5 text-amber-700" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
        {isDemo ? 'DEMO PREDICTOR' : 'TRAINED MODEL'}
      </span>
      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
        {modelName || 'agronomic-heuristics'}
      </span>
      {confidence != null && (
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {(confidence * 100).toFixed(1)}% Confidence
        </span>
      )}
    </div>
  );
}

export function WeatherProviderBadge({ status, providerName }) {
  const isLive = status === 'live-provider';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      isLive 
        ? 'bg-sky-50 text-sky-900 border-sky-300' 
        : 'bg-amber-50 text-amber-900 border-amber-300'
    }`}>
      <CloudSun className={`w-3.5 h-3.5 ${isLive ? 'text-sky-600' : 'text-amber-600'}`} />
      <span className="font-semibold">{isLive ? 'LIVE WEATHER FEED' : 'SIMULATED DEMO WEATHER'}</span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-600 truncate max-w-[200px]">{providerName || (isLive ? 'Open-Meteo' : 'Regional Simulator')}</span>
    </span>
  );
}

export function IrrigationStatusBadge({ status }) {
  let style = 'bg-gray-100 text-gray-800 border-gray-300';
  let icon = <Droplets className="w-4 h-4" />;

  switch (status) {
    case 'Irrigate now':
      style = 'bg-red-50 text-red-800 border-red-300 font-bold';
      icon = <AlertCircle className="w-4 h-4 text-red-600" />;
      break;
    case 'Delay irrigation':
      style = 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
      icon = <Clock className="w-4 h-4 text-amber-600" />;
      break;
    case 'Light irrigation may be suitable':
      style = 'bg-blue-50 text-blue-900 border-blue-300 font-semibold';
      icon = <Droplets className="w-4 h-4 text-blue-600" />;
      break;
    case 'Irrigation may not be required':
      style = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold';
      icon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      break;
    case 'Monitor soil moisture':
    default:
      style = 'bg-stone-100 text-stone-800 border-stone-300 font-medium';
      icon = <Droplets className="w-4 h-4 text-stone-600" />;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wide border ${style}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}
