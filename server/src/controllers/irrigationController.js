import { calculateIrrigationAdvice } from '../services/irrigation/irrigationService.js';

export function handleGetIrrigationAdvice(req, res) {
  try {
    const inputs = req.validatedBody;
    const advice = calculateIrrigationAdvice(inputs);

    return res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('Irrigation controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to compute irrigation advice.'
    });
  }
}
