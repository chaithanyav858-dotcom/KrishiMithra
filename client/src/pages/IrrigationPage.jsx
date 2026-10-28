import React, { useState, useEffect } from 'react';
import { useFlow } from '../context/FlowContext';
import { useAuth } from '../context/AuthContext';
import { irrigationApi, weatherApi, historyApi } from '../api/agriApi';
import { IrrigationAdviceCard } from '../components/irrigation/IrrigationAdviceCard';
import { LoadingSpinner, AlertBanner } from '../components/common/UiFeedback';
import { 
  Droplets, 
  Wheat, 
  MapPin, 
  CloudSun, 
  Clock, 
  RotateCcw, 
  Layers, 
  Sparkles,
  ArrowRight,
  History
} from 'lucide-react';

export function IrrigationPage({ setActivePage }) {
  const { 
    formData, 
    recommendationResult, 
    weatherSnapshot, 
    setWeatherSnapshot, 
    irrigationResult, 
    setIrrigationResult 
  } = useFlow();
  const { isAuthenticated } = useAuth();

  // Inputs for irrigation evaluation
  const [params, setParams] = useState({
    crop: recommendationResult?.crop || 'Finger Millet (Ragi)',
    soilType: formData.soilType || 'red_loamy',
    location: formData.location || 'Hassan, Karnataka',
    growthStage: 'Vegetative / Tillering',
    soilMoisture: formData.soilMoisture || 40,
    recentRainfall: formData.rainfall ? Math.round(formData.rainfall / 10) : 2,
    forecastRainChance: weatherSnapshot?.rainChance || 30,
    forecastPrecipitation: weatherSnapshot?.precipitation || 1.5,
    temperature: weatherSnapshot?.temperature || 26,
    humidity: weatherSnapshot?.humidity || 68
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync with weather snapshot if loaded
  useEffect(() => {
    if (weatherSnapshot) {
      setParams(prev => ({
        ...prev,
        forecastRainChance: weatherSnapshot.rainChance != null ? weatherSnapshot.rainChance : prev.forecastRainChance,
        forecastPrecipitation: weatherSnapshot.precipitation != null ? weatherSnapshot.precipitation : prev.forecastPrecipitation,
        temperature: weatherSnapshot.temperature != null ? weatherSnapshot.temperature : prev.temperature,
        humidity: weatherSnapshot.humidity != null ? weatherSnapshot.humidity : prev.humidity,
        location: weatherSnapshot.location || prev.location
      }));
    }
  }, [weatherSnapshot]);

  const handleComputeAdvice = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaved(false);

    try {
      const response = await irrigationApi.getAdvice(params);
      if (response.success && response.data) {
        setIrrigationResult(response.data);
      } else {
        throw new Error(response.error || 'Failed to calculate irrigation directive.');
      }
    } catch (err) {
      console.error('Irrigation advice calculation error:', err);
      setErrorMessage(err.message || 'Unable to compute irrigation advice.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCompleteConsultation = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Please sign in or use Demo Farmer Access to save consultation records.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        crop: params.crop,
        modelStatus: recommendationResult?.status || 'demo',
        modelName: recommendationResult?.model || 'demo-agronomic-heuristics-v1',
        confidence: recommendationResult?.confidence || null,
        explanation: recommendationResult?.explanation || [
          `Targeted crop ${params.crop} cultivated in ${params.soilType.replace('_', ' ')} soil.`,
          `Water schedule calculated with ${params.growthStage} physiological requirement.`
        ],
        growingConditions: recommendationResult?.growingConditions || null,
        inputs: {
          location: params.location,
          soilType: params.soilType,
          season: formData.season || 'kharif',
          nitrogen: formData.nitrogen || 60,
          phosphorus: formData.phosphorus || 40,
          potassium: formData.potassium || 40,
          soilMoisture: params.soilMoisture,
          temperature: params.temperature,
          humidity: params.humidity
        },
        weatherSnapshot: weatherSnapshot || {
          location: params.location,
          temperature: params.temperature,
          humidity: params.humidity,
          rainChance: params.forecastRainChance,
          precipitation: params.forecastPrecipitation,
          providerStatus: 'demo-weather',
          providerName: 'Agro-Meteorological Baseline Simulator'
        },
        irrigationAdvice: irrigationResult
      };

      const res = await historyApi.saveRecommendation(payload);
      if (res.success) {
        setIsSaved(true);
        setSuccessMessage('Complete consultation (Crop + Weather Snapshot + Irrigation Plan) successfully persisted to history!');
      } else {
        throw new Error(res.error || 'Failed to save record.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving consultation record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncWeatherNow = async () => {
    try {
      const res = await weatherApi.getWeather(params.location);
      if (res.success && res.data) {
        setWeatherSnapshot(res.data);
        setSuccessMessage(`Synchronized with ${res.data.providerStatus === 'live-provider' ? 'live Open-Meteo' : 'regional demo'} forecast.`);
      }
    } catch (err) {
      setErrorMessage('Could not update live weather for this location.');
    }
  };

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Droplets className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Agro-Hydrological Irrigation Advisory
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Combines crop water consumption (ETc), soil texture, in-situ soil moisture, and forecast rainfall to schedule watering.
          </p>
        </div>

        <button
          onClick={() => setActivePage('history')}
          className="px-4 py-2 rounded-xl border border-soil-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <History className="w-4 h-4 text-gray-500" />
          <span>Open Saved History</span>
        </button>
      </div>

      {errorMessage && (
        <AlertBanner type="danger" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {successMessage && (
        <AlertBanner type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {/* Confirmation and Parameter Adjustment Form */}
      <form onSubmit={handleComputeAdvice} className="agri-card p-6 bg-white border-soil-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-soil-100">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-agri" />
            Confirm Target Crop & Field Parameters
          </h3>
          <button
            type="button"
            onClick={handleSyncWeatherNow}
            className="text-xs text-sky-700 font-semibold hover:underline flex items-center gap-1"
          >
            <CloudSun className="w-3.5 h-3.5 text-sky-600" />
            <span>Sync live forecast ({params.forecastRainChance}% rain chance)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Selected Crop <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={params.crop}
              onChange={(e) => setParams({ ...params, crop: e.target.value })}
              placeholder="e.g. Finger Millet (Ragi)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri bg-[#faf9f7]"
            />
            <p className="text-[11px] text-gray-500 mt-1">Carried from recommendation step or custom crop.</p>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Soil Type <span className="text-red-500">*</span>
            </label>
            <select
              value={params.soilType}
              onChange={(e) => setParams({ ...params, soilType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri bg-[#faf9f7]"
            >
              <option value="red_loamy">Red Sandy / Loamy (Moderate holding)</option>
              <option value="black_regur">Black / Regur (High holding)</option>
              <option value="loamy">Loamy Soil (Balanced drainage)</option>
              <option value="clayey">Clayey Soil (Very high holding)</option>
              <option value="laterite">Laterite Soil (Rapid percolation)</option>
              <option value="sandy">Sandy Soil (Fast leaching)</option>
              <option value="alluvial">Alluvial Soil (River loam)</option>
            </select>
            <p className="text-[11px] text-gray-500 mt-1">Dictates field water capacity and drainage rate.</p>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Crop Growth Stage
            </label>
            <select
              value={params.growthStage}
              onChange={(e) => setParams({ ...params, growthStage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri bg-[#faf9f7]"
            >
              <option value="Vegetative / Tillering">Vegetative / Tillering (Moderate demand)</option>
              <option value="Flowering / Panicle Emergence">Flowering / Heading (Critical high demand)</option>
              <option value="Grain / Pod Filling">Grain / Pod Filling (Moderate demand)</option>
              <option value="Ripening / Pre-Harvest">Ripening / Pre-Harvest (Low water demand)</option>
            </select>
            <p className="text-[11px] text-gray-500 mt-1">Affects crop coefficient Kc and stress tolerance.</p>
          </div>
        </div>

        {/* Moisture Slider & Weather Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Soil Moisture Slider */}
          <div className="p-4 rounded-xl bg-[#faf9f6] border border-soil-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-800">
                Available Soil Moisture (%)
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {params.soilMoisture}% Volumetric
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">From soil sensor or estimated by feel & appearance.</p>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={params.soilMoisture}
              onChange={(e) => setParams({ ...params, soilMoisture: parseFloat(e.target.value) || 0 })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>10% (Wilting deficit)</span>
              <span>45% (Optimal depletion)</span>
              <span>85% (Field capacity)</span>
            </div>
          </div>

          {/* Meteorological Outlook Snapshot */}
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  Forecast Rain & Microclimate
                </span>
                <span className="text-xs font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-sky-200">
                  {params.forecastRainChance}% Rain Chance
                </span>
              </div>
              <p className="text-xs text-sky-800 leading-relaxed">
                Temperature: <strong>{params.temperature}°C</strong> • Humidity: <strong>{params.humidity}%</strong> • Projected rain: <strong>{params.forecastPrecipitation} mm</strong>
              </p>
            </div>
            <p className="text-[11px] text-sky-700 mt-2 italic">
              * If rain probability &gt; 50%, system automatically directs irrigation delay to prevent runoff.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Computing Hydro-Balance...' : 'Compute Irrigation Directive'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Results View */}
      {isLoading ? (
        <LoadingSpinner message="Evaluating soil water tension and upcoming rain probability..." />
      ) : irrigationResult ? (
        <IrrigationAdviceCard
          advice={irrigationResult}
          inputs={params}
          onSave={handleSaveCompleteConsultation}
          isSaved={isSaved}
          isSaving={isSaving}
          onEditInputs={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : null}
    </div>
  );
}
