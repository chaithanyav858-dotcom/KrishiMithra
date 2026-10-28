import React, { useState } from 'react';
import { 
  Wheat, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  BookmarkPlus, 
  Check, 
  Droplets, 
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
  CheckCircle2,
  Calendar,
  CloudSun
} from 'lucide-react';
import { ModelBadge } from '../common/StatusBadge';

const KANNADA_CROP_NAMES = {
  'Finger Millet (Ragi)': 'ರಾಗಿ (Ragi)',
  'Paddy (Rice)': 'ಭತ್ತ (Paddy / Rice)',
  'Maize (Corn)': 'ಮೆಕ್ಕೆಜೋಳ (Maize / Corn)',
  'Groundnut (Peanut)': 'ಕಡಲೆಕಾಯಿ (Groundnut / Shenga)',
  'Cotton': 'ಹತ್ತಿ (Cotton)',
  'Sugarcane': 'ಕಬ್ಬು (Sugarcane)',
  'Coffee (Arabica / Robusta)': 'ಕಾಫಿ (Coffee)',
  'Chickpea (Bengal Gram)': 'ಕಡಲೆ (Bengal Gram / Chana)',
  'Sorghum (Jowar)': 'ಜೋಳ (Jowar / Sorghum)',
  'Sunflower': 'ಸೂರ್ಯಕಾಂತಿ (Sunflower)',
};

export function CropInputForm({ formData, onChange, onSubmit, isLoading, onAutoFillWeather }) {
  const [showOptional, setShowOptional] = useState(false);
  const [hasSoilReport, setHasSoilReport] = useState(() => formData.nitrogen != null && formData.nitrogen !== '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="agri-card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-soil-100 pb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wheat className="w-5 h-5 text-agri" />
          <span>Crop Recommendation Form / ಬೆಳೆ ಶಿಫಾರಸು ನಮೂನೆ</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Tell us about your land and soil to find the most profitable crop. / ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಯನ್ನು ತಿಳಿಯಲು ವಿವರಗಳನ್ನು ನೀಡಿ.
        </p>
      </div>

      {/* Simple Farmer Action Guide / ರೈತರಿಗೆ ಸುಲಭ ಸೂಚನೆಗಳು */}
      <div className="p-4 rounded-2xl bg-[#f5f9f4] border border-agri-mist">
        <h4 className="text-xs font-bold text-agri-deep uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
          <HelpCircle className="w-4 h-4 text-agri" />
          <span>Simple Guide for Farmers / ರೈತರಿಗೆ ಸುಲಭ ಹಂತಗಳು</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-gray-700">
          <div className="p-3 rounded-xl bg-white border border-soil-200">
            <strong className="text-agri block text-xs">1. Location / ನಿಮ್ಮ ಊರು</strong>
            <p className="text-[11px] text-gray-600 mt-0.5">Enter your village or district name.<br /><span className="text-gray-500">ನಿಮ್ಮ ಊರು ಅಥವಾ ಜಿಲ್ಲೆಯ ಹೆಸರು ಹಾಕಿ.</span></p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-soil-200">
            <strong className="text-agri block text-xs">2. Soil & Season / ಮಣ್ಣು ಮತ್ತು ಕಾಲ</strong>
            <p className="text-[11px] text-gray-600 mt-0.5">Select your soil type and sowing season.<br /><span className="text-gray-500">ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಬಿತ್ತನೆ ಕಾಲ ಆಯ್ಕೆಮಾಡಿ.</span></p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-soil-200">
            <strong className="text-agri block text-xs">3. N-P-K (Optional / ಐಚ್ಛಿಕ)</strong>
            <p className="text-[11px] text-gray-600 mt-0.5">Have soil test numbers? Tick the box, or skip it!<br /><span className="text-gray-500">ಮಣ್ಣು ಪರೀಕ್ಷೆ ಚೀಟಿ ಇದ್ದರೆ ಹಾಕಿ, ಇಲ್ಲದಿದ್ದರೆ ಬಿಡಿ!</span></p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-soil-200">
            <strong className="text-agri block text-xs">4. Get Best Crop / ಬೆಳೆ ತಿಳಿಯಿರಿ</strong>
            <p className="text-[11px] text-gray-600 mt-0.5">Click the green button below to see suggestions.<br /><span className="text-gray-500">ಉತ್ತಮ ಬೆಳೆ ತಿಳಿಯಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.</span></p>
          </div>
        </div>
      </div>

      {/* Primary Section: Location, Soil, Season */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Location / ಊರು - ಜಿಲ್ಲೆ <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="e.g. Hassan, Karnataka"
              className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
            />
            <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Hassan, Mandya, Belagavi, or any district.</p>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Soil Type / ಮಣ್ಣಿನ ಪ್ರಕಾರ <span className="text-red-500">*</span></span>
          </label>
          <select
            value={formData.soilType}
            onChange={(e) => onChange({ soilType: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
          >
            <option value="red_loamy">Red Sandy / Loamy (ಕೆಂಪು ಮಣ್ಣು - Hassan & South Kar)</option>
            <option value="black_regur">Black / Regur Soil (ಕಪ್ಪು / ಎರೇ ಮಣ್ಣು - North Kar)</option>
            <option value="alluvial">Alluvial Soil (ಮೆಕ್ಕಲು ಮಣ್ಣು - River Basins)</option>
            <option value="laterite">Laterite Soil (ಲ್ಯಾಟರೈಟ್ / ಜಂಬಿಟ್ಟಿಗೆ - Malnad)</option>
            <option value="clayey">Clayey Soil (ಜೇಡಿ ಮಣ್ಣು - Wetland / Paddy)</option>
            <option value="loamy">Loamy Soil (ಗೋಡು ಮಣ್ಣು - Balanced Texture)</option>
            <option value="sandy">Sandy Soil (ಮರಳು ಮಣ್ಣು - Fast Drainage)</option>
          </select>
          <p className="text-[11px] text-gray-500 mt-1">Water holding and root aeration.</p>
        </div>

        {/* Cropping Season */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Sowing Season / ಬಿತ್ತನೆ ಕಾಲ <span className="text-red-500">*</span></span>
          </label>
          <select
            value={formData.season}
            onChange={(e) => onChange({ season: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
          >
            <option value="kharif">Kharif / ಮುಂಗಾರು ಮಳೆಗಾಲ (Jun - Oct)</option>
            <option value="rabi">Rabi / ಹಿಂಗಾರು ಚಳಿಗಾಲ (Oct - Mar)</option>
            <option value="zaid">Zaid / ಬೇಸಿಗೆ ಕಾಲ (Mar - Jun)</option>
            <option value="whole_year">Whole Year / ವಾರ್ಷಿಕ ಬೆಳೆ</option>
          </select>
          <p className="text-[11px] text-gray-500 mt-1">Select when you want to sow seeds.</p>
        </div>
      </div>

      {/* Nutrients Section: N, P, K (Optional) */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-agri" />
              <span>Soil Nutrients (N - P - K) / ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳು</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Optional / ಐಚ್ಛಿಕ
              </span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Tick the box only if you have a Soil Health Card report. / ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸಿದ್ದರೆ ಮಾತ್ರ ಬಾಕ್ಸ್ ಟಿಕ್ ಮಾಡಿ.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer bg-[#faf8f5] px-3.5 py-1.5 rounded-xl border border-soil-300 hover:border-agri transition-colors select-none self-start sm:self-auto">
            <input
              type="checkbox"
              checked={hasSoilReport}
              onChange={(e) => {
                const checked = e.target.checked;
                setHasSoilReport(checked);
                if (!checked) {
                  onChange({ nitrogen: null, phosphorus: null, potassium: null });
                } else {
                  onChange({ nitrogen: 65, phosphorus: 40, potassium: 40 });
                }
              }}
              className="accent-agri w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">Enter N-P-K Readings / N-P-K ನಮೂದಿಸಿ</span>
          </label>
        </div>

        {hasSoilReport ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#fbfaf8] p-5 rounded-2xl border border-soil-200">
            {/* Nitrogen */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Nitrogen (N) / ಸಾರಜನಕ
                </label>
                <span className="text-xs font-bold text-agri-deep bg-agri-mist px-2 py-0.5 rounded">
                  {formData.nitrogen ?? 0} kg/ha
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Leaf & plant growth / ಹಸಿರು ಎಲೆಗಳ ಬೆಳವಣಿಗೆಗೆ.</p>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={formData.nitrogen ?? 0}
                onChange={(e) => onChange({ nitrogen: parseFloat(e.target.value) || 0 })}
                className="w-full accent-agri cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 (Low)</span>
                <span>100 (Medium)</span>
                <span>250 (High)</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Phosphorus (P) / ರಂಜಕ
                </label>
                <span className="text-xs font-bold text-agri-deep bg-agri-mist px-2 py-0.5 rounded">
                  {formData.phosphorus ?? 0} kg/ha
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Roots & flowers / ಬೇರು ಮತ್ತು ಹೂ ಬಿಡಲು.</p>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={formData.phosphorus ?? 0}
                onChange={(e) => onChange({ phosphorus: parseFloat(e.target.value) || 0 })}
                className="w-full accent-agri cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 (Low)</span>
                <span>60 (Medium)</span>
                <span>150 (High)</span>
              </div>
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Potassium (K) / ಪೊಟ್ಯಾಷ್
                </label>
                <span className="text-xs font-bold text-agri-deep bg-agri-mist px-2 py-0.5 rounded">
                  {formData.potassium ?? 0} kg/ha
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Disease protection / ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿಗೆ.</p>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={formData.potassium ?? 0}
                onChange={(e) => onChange({ potassium: parseFloat(e.target.value) || 0 })}
                className="w-full accent-agri cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 (Low)</span>
                <span>80 (Medium)</span>
                <span>180 (High)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-dashed border-soil-300 text-xs text-gray-600 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-agri/10 text-agri flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-gray-800">
                Macronutrients Omitted (Standard Mode) / ಮಣ್ಣು ಪರೀಕ್ಷೆ ಚೀಟಿ ಇಲ್ಲದಿದ್ದರೆ ಪರವಾಗಿಲ್ಲ
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                The recommendation engine will suggest suitable crops based on your soil type and seasonal weather. / ನಿಮ್ಮ ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ ಸೂಕ್ತ ಬೆಳೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional Climate & Soil Parameters (Collapsible Accordion) */}
      <div className="border border-soil-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="w-full px-4 py-3 bg-[#f8f6f2] hover:bg-[#f1ede4] flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Advanced Climate & Soil Parameters / ಹೆಚ್ಚಿನ ಹವಾಮಾನ ಮಾಹಿತಿ
            </span>
            <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
              Optional / ಐಚ್ಛಿಕ
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-agri font-medium">
            <span>{showOptional ? 'Hide / ಮರೆಮಾಡಿ' : 'Configure pH & Rain / ತಾಪಮಾನ ಮತ್ತು ಮಳೆ'}</span>
            {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showOptional && (
          <div className="p-5 bg-white space-y-4 border-t border-soil-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-soil-100">
              <p className="text-xs text-gray-600">
                Auto-fill current temperature and humidity directly from local weather. / ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ತಕ್ಷಣ ತುಂಬಿಕೊಳ್ಳಿ.
              </p>
              {onAutoFillWeather && (
                <button
                  type="button"
                  onClick={onAutoFillWeather}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Auto-fill from weather / ಇಂದಿನ ಹವಾಮಾನ ತುಂಬಿ
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Soil pH / ಮಣ್ಣಿನ pH
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="10.0"
                  value={formData.ph || ''}
                  onChange={(e) => onChange({ ph: parseFloat(e.target.value) || null })}
                  placeholder="6.5"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-soil-300 bg-[#fbfaf8]"
                />
                <span className="text-[10px] text-gray-500">Optimum: 6.0 - 7.5</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Moisture (%) / ತೇವಾಂಶ
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.soilMoisture || ''}
                  onChange={(e) => onChange({ soilMoisture: parseFloat(e.target.value) || null })}
                  placeholder="45"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-soil-300 bg-[#fbfaf8]"
                />
                <span className="text-[10px] text-gray-500">Soil moisture %</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Temp (°C) / ತಾಪಮಾನ
                </label>
                <input
                  type="number"
                  value={formData.temperature || ''}
                  onChange={(e) => onChange({ temperature: parseFloat(e.target.value) || null })}
                  placeholder="26"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-soil-300 bg-[#fbfaf8]"
                />
                <span className="text-[10px] text-gray-500">Degrees Celsius</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Humidity (%) / ಗಾಳಿಯ ತೇವ
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.humidity || ''}
                  onChange={(e) => onChange({ humidity: parseFloat(e.target.value) || null })}
                  placeholder="70"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-soil-300 bg-[#fbfaf8]"
                />
                <span className="text-[10px] text-gray-500">Relative humidity</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Rain (mm) / ಅಂದಾಜು ಮಳೆ
                </label>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={formData.rainfall || ''}
                  onChange={(e) => onChange({ rainfall: parseFloat(e.target.value) || null })}
                  placeholder="120"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-soil-300 bg-[#fbfaf8]"
                />
                <span className="text-[10px] text-gray-500">Season rainfall</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          * Location, Soil Type, and Season are required. N-P-K nutrients are optional.<br />
          <span className="text-gray-400">* ಊರು, ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು ಬಿತ್ತನೆ ಕಾಲ ಕಡ್ಡಾಯ. ಪೋಷಕಾಂಶಗಳ ವಿವರ ಐಚ್ಛಿಕ.</span>
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-agri hover:bg-agri-deep text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Evaluating Best Crop / ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗುತ್ತಿದೆ...</span>
            </>
          ) : (
            <>
              <span>Find Best Crop / ಸೂಕ್ತವಾದ ಬೆಳೆ ತಿಳಿಯಿರಿ</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function CropRecommendationCard({ 
  result, 
  onProceedIrrigation, 
  onSave, 
  isSaved, 
  isSaving,
  onViewWeather
}) {
  if (!result) return null;

  const { crop, status, model, confidence, explanation, growingConditions, suitableAlternatives } = result;
  const kannadaName = growingConditions?.kannadaName || KANNADA_CROP_NAMES[crop];

  return (
    <div className="agri-card p-6 md:p-8 bg-gradient-to-br from-white via-white to-[#f6faf5] border-agri/40 shadow-md">
      {/* Top Banner with Model Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-soil-100">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-agri">
            Recommended Crop / ನಿಮಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆ
          </span>
          <div className="flex items-baseline gap-2.5 flex-wrap mt-0.5">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {crop}
            </h2>
            {kannadaName && (
              <span className="text-xl sm:text-2xl font-bold text-agri">
                • {kannadaName}
              </span>
            )}
          </div>
          {growingConditions?.botanicalName && (
            <p className="text-xs italic text-gray-500 font-serif mt-1">
              {growingConditions.botanicalName} ({growingConditions.category})
            </p>
          )}
        </div>

        <ModelBadge status={status} modelName={model} confidence={confidence} />
      </div>

      {/* Prominent Bilingual Action Guide: What Should You Do Next? */}
      <div className="mt-6 p-5 rounded-2xl bg-[#fafdf8] border-2 border-agri-mist">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-agri" />
          <h4 className="text-sm font-bold text-agri-deep uppercase tracking-wide">
            What You Need To Do Next / ಮುಂದೆ ನೀವು ಏನು ಮಾಡಬೇಕು?
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-white border border-soil-200">
            <span className="text-xs font-bold text-agri block mb-1">
              1. Prepare Your Field / ಜಮೀನು ಸಿದ್ಧಪಡಿಸಿ
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              {growingConditions?.simpleInstructionEn || `Plow and level your soil. Buy good quality certified seeds for ${crop}.`}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {growingConditions?.simpleInstructionKn || 'ಮಣ್ಣನ್ನು ಹದವಾಗಿ ಉಳುಮೆ ಮಾಡಿ. ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಬಿತ್ತನೆ ಬೀಜಗಳನ್ನು ಆಯ್ದುಕೊಳ್ಳಿ.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-soil-200">
            <span className="text-xs font-bold text-sky-700 block mb-1">
              2. Check Local Weather / ಇಂದಿನ ಹವಾಮಾನ ಗಮನಿಸಿ
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Check rain forecast before sowing so heavy showers do not wash away seeds.
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              ಬಿತ್ತಿದ ಬೀಜ ಮಳೆಗೆ ಕೊಚ್ಚಿಹೋಗದಂತೆ ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಹವಾಮಾನ ಪರಿಶೀಲಿಸಿ.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-soil-200">
            <span className="text-xs font-bold text-blue-700 block mb-1">
              3. Get Watering Advice / ನೀರು ಹಾಯಿಸುವ ಸಲಹೆ ಪಡೆಯಿರಿ
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Click "Proceed to Irrigation" below to see if your field needs water today.
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              ಇಂದು ಜಮೀನಿಗೆ ನೀರು ಹಾಯಿಸಬೇಕೇ ಅಥವಾ ಮಳೆ ಬರುವುದರಿಂದ ಮುಂದೂಡಬೇಕೇ ಎಂದು ತಿಳಿಯಲು ಕೆಳಗಿನ ನೀರಾವರಿ ಬಟನ್ ಒತ್ತಿ.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-soil-200">
            <span className="text-xs font-bold text-amber-700 block mb-1">
              4. Save This Record / ಈ ದಾಖಲೆ ಉಳಿಸಿಕೊಳ್ಳಿ
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Click "Save to History" so you can open and review this advice anytime.
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              ಈ ಬೆಳೆ ಮಾಹಿತಿಯನ್ನು ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಸೇವ್ (Save) ಮಾಡಿ ಇಟ್ಟುಕೊಳ್ಳಿ.
            </p>
          </div>
        </div>
      </div>

      {/* Regional Context Callout */}
      {growingConditions?.regionalContext && (
        <div className="mt-4 p-3 rounded-xl bg-[#f2f7f1] border border-agri-mist/80 text-xs text-agri-deep flex items-start gap-2.5">
          <Info className="w-4 h-4 text-agri shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Regional Relevance (ಪ್ರಾದೇಶಿಕ ಮಹತ್ವ):</span> {growingConditions.regionalContext}
          </div>
        </div>
      )}

      {/* Agronomic Explanation Points */}
      <div className="mt-6 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Why this crop fits your land / ಈ ಬೆಳೆ ಏಕೆ ಸೂಕ್ತವಾಗಿದೆ?
        </h4>
        <ul className="space-y-2">
          {explanation?.map((item, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2.5 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-agri-mist text-agri-deep flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Growing Conditions Matrix */}
      {growingConditions && (
        <div className="mt-6 pt-5 border-t border-soil-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
            Cultivation Guidelines / ಬೆಳೆ ನಿರ್ವಹಣಾ ಮಾರ್ಗದರ್ಶಿ:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-soil-200">
              <p className="text-[11px] text-gray-500 font-medium">Ideal N-P-K Range (ಪೋಷಕಾಂಶ ಪ್ರಮಾಣ)</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5">
                N: {growingConditions.idealNPK?.n?.join('-')} | P: {growingConditions.idealNPK?.p?.join('-')} | K: {growingConditions.idealNPK?.k?.join('-')} kg/ha
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-soil-200">
              <p className="text-[11px] text-gray-500 font-medium">Water Requirement (ನೀರಿನ ಅಗತ್ಯತೆ)</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5">
                {growingConditions.waterRequirement}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-soil-200">
              <p className="text-[11px] text-gray-500 font-medium">Critical Growth Stages (ಮುಖ್ಯ ಹಂತಗಳು)</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5 truncate" title={growingConditions.criticalStages?.join(', ')}>
                {growingConditions.criticalStages?.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alternatives */}
      {suitableAlternatives?.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="font-semibold text-gray-700">Other Suitable Crops / ಇತರ ಸೂಕ್ತ ಬೆಳೆಗಳು:</span>
          {suitableAlternatives.map((alt, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800 font-medium">
              {alt} {KANNADA_CROP_NAMES[alt] ? `(${KANNADA_CROP_NAMES[alt].split(' ')[0]})` : ''}
            </span>
          ))}
        </div>
      )}

      {/* Flow Action Buttons */}
      <div className="mt-8 pt-5 border-t border-soil-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onSave}
          disabled={isSaved || isSaving}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            isSaved
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 cursor-default'
              : 'border-soil-300 text-gray-700 hover:bg-gray-50 hover:border-agri'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Saved in History / ಉಳಿಸಲಾಗಿದೆ</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4 text-agri" />
              <span>{isSaving ? 'Saving...' : 'Save to History / ಹಿಸ್ಟರಿಗೆ ಸೇವ್ ಮಾಡಿ'}</span>
            </>
          )}
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          {onViewWeather && (
            <button
              onClick={onViewWeather}
              className="px-4 py-2.5 rounded-xl border border-sky-300 text-sky-800 hover:bg-sky-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <CloudSun className="w-4 h-4 text-sky-600" />
              <span>View Weather / ಹವಾಮಾನ ನೋಡಿ</span>
            </button>
          )}

          <button
            onClick={onProceedIrrigation}
            className="px-6 py-2.5 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Droplets className="w-4 h-4 text-agri-mist" />
            <span>Proceed to Irrigation / ನೀರು ಹಾಯಿಸುವ ಸಲಹೆ ಪಡೆಯಿರಿ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
