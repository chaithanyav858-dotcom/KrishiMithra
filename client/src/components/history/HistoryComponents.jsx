import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Wheat, 
  CloudSun, 
  Droplets, 
  ArrowRight, 
  Trash2, 
  Layers, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ModelBadge, IrrigationStatusBadge, WeatherProviderBadge } from '../common/StatusBadge';
import { Modal } from '../common/UiFeedback';

export function HistoryCard({ item, onInspect, onDelete }) {
  return (
    <div className="agri-card p-5 hover:border-agri transition-all shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-soil-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-agri/10 text-agri flex items-center justify-center font-bold">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900 leading-tight">{item.crop}</h4>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                {item.location} ({item.farmName})
              </p>
            </div>
          </div>
          <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Conditions Summary */}
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-600 bg-[#faf8f5] p-2 rounded-lg">
            <span>Soil: <strong className="capitalize text-gray-800">{item.soilType?.replace('_', ' ')}</strong></span>
            <span>Season: <strong className="capitalize text-gray-800">{item.season}</strong></span>
          </div>

          {item.weatherSummary && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 px-1">
              <CloudSun className="w-3.5 h-3.5 text-sky-600" />
              <span>Weather: {item.weatherSummary}</span>
            </div>
          )}

          <p className="text-xs text-gray-500 line-clamp-2 px-1 pt-1 italic">
            "{item.summaryExcerpt}"
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-soil-100 flex items-center justify-between gap-2">
        <div className="truncate">
          <IrrigationStatusBadge status={item.irrigationStatus} />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete record"
              aria-label="Delete consultation record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onInspect(item.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-agri/10 text-agri hover:bg-agri hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Inspect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function HistoryDetailModal({ record, isOpen, onClose, onLoadIntoWizard }) {
  if (!record) return null;

  const {
    crop,
    modelStatus,
    modelName,
    confidence,
    explanation,
    inputs,
    farm,
    weatherSnapshot,
    irrigationAdvice,
    createdAt
  } = record;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historical Consultation Snapshot" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-soil-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-agri">Saved Consultation</span>
            <h3 className="text-2xl font-black text-gray-900">{crop}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Recorded on {new Date(createdAt).toLocaleString()} for {farm?.name || 'Primary Farm'} ({inputs.location || farm?.location})
            </p>
          </div>
          <ModelBadge status={modelStatus} modelName={modelName} confidence={confidence} />
        </div>

        {/* 1. Submitted Inputs Snapshot */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-agri" />
            1. Farmer & Soil Inputs at Consultation Time
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#faf8f5] p-3.5 rounded-xl border border-soil-200 text-xs">
            <div>
              <span className="text-gray-500 block text-[11px]">Soil Type</span>
              <strong className="capitalize text-gray-900">{inputs.soilType?.replace('_', ' ')}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Season</span>
              <strong className="capitalize text-gray-900">{inputs.season}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Nitrogen (N)</span>
              <strong className="text-gray-900">{inputs.nitrogen} kg/ha</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Phosphorus (P)</span>
              <strong className="text-gray-900">{inputs.phosphorus} kg/ha</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Potassium (K)</span>
              <strong className="text-gray-900">{inputs.potassium} kg/ha</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Soil pH</span>
              <strong className="text-gray-900">{inputs.ph != null ? inputs.ph : 'Not supplied'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Soil Moisture</span>
              <strong className="text-gray-900">{inputs.soilMoisture != null ? `${inputs.soilMoisture}%` : 'Estimated'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Rainfall</span>
              <strong className="text-gray-900">{inputs.rainfall != null ? `${inputs.rainfall} mm` : 'Regional avg'}</strong>
            </div>
          </div>
        </div>

        {/* 2. Crop Explanation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            2. Agronomic Compatibility Reasoning
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-700 bg-white p-3 rounded-xl border border-soil-200">
            {explanation?.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-agri font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Weather Snapshot at the time */}
        {weatherSnapshot && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-sky-600" />
                3. Weather Snapshot at Consultation
              </h4>
              <WeatherProviderBadge 
                status={weatherSnapshot.providerStatus} 
                providerName={weatherSnapshot.providerName} 
              />
            </div>
            <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Temperature</span>
                <strong className="text-gray-900">{weatherSnapshot.temperature}°C</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Condition</span>
                <strong className="text-gray-900">{weatherSnapshot.conditionText}</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Humidity</span>
                <strong className="text-gray-900">{weatherSnapshot.humidity}%</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Rain Chance</span>
                <strong className="text-gray-900">{weatherSnapshot.rainChance}%</strong>
              </div>
            </div>
          </div>
        )}

        {/* 4. Saved Irrigation Advice */}
        {irrigationAdvice && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-agri" />
                4. Saved Irrigation Advice & Actions
              </h4>
              <IrrigationStatusBadge status={irrigationAdvice.status} />
            </div>
            <div className="p-4 bg-[#f8faf8] rounded-xl border border-soil-200 space-y-3 text-xs">
              <p className="text-gray-800 leading-relaxed font-medium">
                {irrigationAdvice.adviceText}
              </p>
              {irrigationAdvice.actions?.length > 0 && (
                <div className="pt-2 border-t border-soil-200/80">
                  <p className="font-bold text-gray-700 mb-1.5">Operational Actions:</p>
                  <ul className="space-y-1">
                    {irrigationAdvice.actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-gray-600">
                        <span className="text-agri font-bold">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-soil-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-soil-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>

          {onLoadIntoWizard && (
            <button
              onClick={() => {
                onLoadIntoWizard(record);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Load into Active Advisory Flow</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
