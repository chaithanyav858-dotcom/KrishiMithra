import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { useAuth } from '../context/AuthContext';
import { predictionApi, weatherApi, historyApi } from '../api/agriApi';
import { CropInputForm, CropRecommendationCard } from '../components/recommendation/CropComponents';
import { AlertBanner } from '../components/common/UiFeedback';
import { Wheat, CheckCircle2, RotateCcw } from 'lucide-react';

export function CropRecommendationPage({ setActivePage }) {
  const { 
    formData, 
    updateFormData, 
    recommendationResult, 
    setRecommendationResult,
    setWeatherSnapshot
  } = useFlow();
  const { isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaved(false);

    try {
      const response = await predictionApi.predictCrop(formData);
      if (response.success && response.data) {
        setRecommendationResult(response.data);
      } else {
        throw new Error(response.error || 'Prediction service failed to return crop suggestions.');
      }
    } catch (err) {
      console.error('Crop prediction error:', err);
      setErrorMessage(err.message || 'Failed to generate recommendation. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFillWeather = async () => {
    try {
      const weatherRes = await weatherApi.getWeather(formData.location);
      if (weatherRes.success && weatherRes.data) {
        const w = weatherRes.data;
        updateFormData({
          temperature: w.temperature,
          humidity: w.humidity,
          rainfall: w.precipitation > 0 ? Math.round(w.precipitation * 30) : 110,
        });
        setWeatherSnapshot(w);
        setSuccessMessage(`Auto-filled climate values from current ${w.location} meteorological feed (${w.temperature}°C, ${w.humidity}% humidity).`);
      }
    } catch (err) {
      setErrorMessage('Could not fetch current local weather for auto-fill. Using standard default values.');
    }
  };

  const handleSaveRecommendation = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Please sign in or use Demo Farmer Access to save consultation records to your history.');
      return;
    }

    if (!recommendationResult) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        crop: recommendationResult.crop,
        modelStatus: recommendationResult.status || 'demo',
        modelName: recommendationResult.model || 'demo-agronomic-heuristics-v1',
        confidence: recommendationResult.confidence || null,
        explanation: recommendationResult.explanation || [],
        growingConditions: recommendationResult.growingConditions || null,
        inputs: formData
      };

      const res = await historyApi.saveRecommendation(payload);
      if (res.success) {
        setIsSaved(true);
        setSuccessMessage('Crop recommendation record saved to your consultation history!');
      } else {
        throw new Error(res.error || 'Failed to save record.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving to history.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedIrrigation = () => {
    // Flow continues smoothly to irrigation advice with crop context preserved
    setActivePage('irrigation');
  };

  const handleViewWeather = () => {
    setActivePage('weather');
  };

  const handleReset = () => {
    setRecommendationResult(null);
    setIsSaved(false);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-agri/10 text-agri">
              <Wheat className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Crop Recommendation / ಬೆಳೆ ಶಿಫಾರಸು
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Simple agricultural guidance for your land. Select your soil and season to discover the best crops. / ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಯನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಿರಿ.
          </p>
        </div>

        {recommendationResult && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-soil-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Soil Evaluation / ಹೊಸ ಪರಿಶೀಲನೆ</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {errorMessage && (
        <AlertBanner type="danger" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {successMessage && (
        <AlertBanner type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {/* Input Form or Results View */}
      {!recommendationResult ? (
        <CropInputForm
          formData={formData}
          onChange={updateFormData}
          onSubmit={handlePredict}
          isLoading={isLoading}
          onAutoFillWeather={handleAutoFillWeather}
        />
      ) : (
        <div className="space-y-6">
          <CropRecommendationCard
            result={recommendationResult}
            onProceedIrrigation={handleProceedIrrigation}
            onViewWeather={handleViewWeather}
            onSave={handleSaveRecommendation}
            isSaved={isSaved}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}
