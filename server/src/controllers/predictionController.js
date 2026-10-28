import { predictCrop } from '../services/prediction/predictionAdapter.js';

export async function handlePredictCrop(req, res) {
  try {
    const inputs = req.validatedBody;
    const predictionResult = await predictCrop(inputs);

    return res.json({
      success: true,
      data: {
        ...predictionResult,
        submittedInputs: inputs
      }
    });
  } catch (error) {
    console.error('Prediction controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Crop recommendation failed. Please verify your inputs and retry.'
    });
  }
}
