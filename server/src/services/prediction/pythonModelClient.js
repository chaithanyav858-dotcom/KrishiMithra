/**
 * KrishiMitra - Python FastAPI ML Model Client Adapter
 * 
 * Provides HTTP client connection to an external Python FastAPI ML model
 * running a trained classifier (e.g. Scikit-learn Random Forest on Crop Recommendation Dataset).
 */

export async function callExternalPythonModel(serviceUrl, inputs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

  try {
    const response = await fetch(`${serviceUrl.replace(/\/+$/, '')}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        soil_type: inputs.soilType,
        season: inputs.season,
        location: inputs.location,
        n: inputs.nitrogen,
        p: inputs.phosphorus,
        k: inputs.potassium,
        ph: inputs.ph || 6.5,
        temperature: inputs.temperature || 25.0,
        humidity: inputs.humidity || 70.0,
        rainfall: inputs.rainfall || 100.0
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Python ML service returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      crop: data.crop,
      status: 'trained-model',
      model: data.model_name || 'python-randomforest-v1',
      confidence: typeof data.confidence === 'number' ? data.confidence : null,
      explanation: Array.isArray(data.explanation) ? data.explanation : [data.explanation || 'Predicted by trained Scikit-Learn Random Forest model.'],
      growingConditions: data.growing_conditions || null,
      suitableAlternatives: data.alternatives || []
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
