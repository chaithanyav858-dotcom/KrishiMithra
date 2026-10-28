/**
 * KrishiMitra - Unified Prediction Service Adapter
 * 
 * Provides a single abstraction boundary between the Express controllers
 * and the underlying prediction engine (Trained Python model or Demo Heuristic Predictor).
 */

import { runDemoCropPrediction } from './demoPredictor.js';
import { callExternalPythonModel } from './pythonModelClient.js';

export async function predictCrop(inputs) {
  const modelServiceUrl = process.env.MODEL_SERVICE_URL?.trim();

  if (modelServiceUrl) {
    try {
      console.log(`Connecting to external Python ML service at: ${modelServiceUrl}`);
      const result = await callExternalPythonModel(modelServiceUrl, inputs);
      return result;
    } catch (error) {
      console.warn(`External Python ML model unavailable (${error.message}). Falling back to honest Demo Agronomic Predictor.`);
      const fallbackResult = runDemoCropPrediction(inputs);
      fallbackResult.serviceNotice = `External model endpoint unreachable (${error.message}). Switched to local Agronomic Heuristic Predictor.`;
      return fallbackResult;
    }
  }

  // Default: Agronomy-based demonstration predictor with honest AI metrics
  return runDemoCropPrediction(inputs);
}
