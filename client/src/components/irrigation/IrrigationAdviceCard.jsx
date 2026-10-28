import React from 'react';
import { 
  Droplets, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  BookmarkPlus, 
  Check, 
  RotateCcw,
  Wheat,
  Thermometer,
  Layers
} from 'lucide-react';
import { IrrigationStatusBadge } from '../common/StatusBadge';

export function IrrigationAdviceCard({ 
  advice, 
  inputs, 
  onSave, 
  isSaved, 
  isSaving,
  onEditInputs 
}) {
  if (!advice) return null;

  const { status, adviceText, actions, missingInputs, cropWaterDemand, soilDrainageNote } = advice;

  return (
    <div className="agri-card p-6 md:p-8 bg-white border-soil-200 shadow-md">
      {/* Header and Urgency Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-soil-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri">
            Agro-Hydrological Irrigation Advisory
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-0.5">
            {inputs?.crop || 'Crop'} Irrigation Directive
          </h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span>Soil: <strong className="text-gray-700 capitalize">{inputs?.soilType?.replace('_', ' ')}</strong></span>
            <span>•</span>
            <span>Demand: <strong className="text-gray-700">{cropWaterDemand || 'Moderate'}</strong></span>
          </p>
        </div>

        <IrrigationStatusBadge status={status} />
      </div>

      {/* Primary Plain-Language Explanation */}
      <div className="mt-6 p-5 rounded-2xl bg-[#f7faf7] border border-agri-mist text-gray-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-agri-deep mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-agri" />
          Field Advisory Summary
        </h4>
        <p className="text-sm leading-relaxed text-gray-800 font-medium">
          {adviceText}
        </p>
        {soilDrainageNote && (
          <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-agri-mist/80 italic">
            Soil Dynamics: {soilDrainageNote}
          </p>
        )}
      </div>

      {/* Practical Action Steps Checklist */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-agri" />
          Recommended Operational Next Steps:
        </h4>
        <div className="space-y-2.5">
          {actions?.map((action, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-[#fcfaf7] border border-soil-200 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-agri/10 text-agri flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency: Missing Data Limitations */}
      {missingInputs?.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            Missing Telemetry & Model Assumptions:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-amber-800">
            {missingInputs.map((missing, i) => (
              <li key={i}>{missing}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-8 pt-5 border-t border-soil-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {onEditInputs && (
          <button
            onClick={onEditInputs}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-soil-300 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Modify Soil / Crop Parameters</span>
          </button>
        )}

        <button
          onClick={onSave}
          disabled={isSaved || isSaving}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            isSaved
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-agri hover:bg-agri-deep text-white shadow-sm'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Full Consultation Saved to History</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4 text-agri-mist" />
              <span>{isSaving ? 'Saving Record...' : 'Save Complete Recommendation Record'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
