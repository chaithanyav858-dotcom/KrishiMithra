import React, { createContext, useContext, useState } from 'react';

const FlowContext = createContext(null);

export function FlowProvider({ children }) {
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [weatherSnapshot, setWeatherSnapshot] = useState(null);
  const [irrigationResult, setIrrigationResult] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Form persistence for crop recommendation
  const [formData, setFormData] = useState({
    location: 'Hassan, Karnataka',
    farmId: '',
    soilType: 'red_loamy',
    season: 'kharif',
    nitrogen: 65,
    phosphorus: 40,
    potassium: 40,
    ph: 6.5,
    soilMoisture: 45,
    temperature: 26,
    humidity: 70,
    rainfall: 120,
  });

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const clearFlow = () => {
    setRecommendationResult(null);
    setWeatherSnapshot(null);
    setIrrigationResult(null);
  };

  const loadFromHistoryRecord = (record) => {
    if (record.inputs) {
      setFormData(prev => ({ ...prev, ...record.inputs }));
    }
    setRecommendationResult({
      crop: record.crop,
      model: record.modelName,
      status: record.modelStatus,
      confidence: record.confidence,
      explanation: record.explanation,
      growingConditions: record.growingConditions,
      submittedInputs: record.inputs
    });
    if (record.weatherSnapshot) {
      setWeatherSnapshot(record.weatherSnapshot);
    }
    if (record.irrigationAdvice) {
      setIrrigationResult(record.irrigationAdvice);
    }
  };

  return (
    <FlowContext.Provider
      value={{
        formData,
        updateFormData,
        recommendationResult,
        setRecommendationResult,
        weatherSnapshot,
        setWeatherSnapshot,
        irrigationResult,
        setIrrigationResult,
        selectedFarm,
        setSelectedFarm,
        clearFlow,
        loadFromHistoryRecord
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
