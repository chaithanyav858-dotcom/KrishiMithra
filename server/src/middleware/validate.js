import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  location: z.string().min(2, 'Location is required (e.g. Hassan, Karnataka)'),
  state: z.string().default('Karnataka')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const farmSchema = z.object({
  farmName: z.string().min(2, 'Farm name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  district: z.string().default('Hassan'),
  state: z.string().default('Karnataka'),
  soilType: z.string().min(2, 'Soil type is required'),
  areaAcres: z.number().positive('Area must be greater than 0'),
  isPrimary: z.boolean().optional().default(false)
});

export const cropPredictionSchema = z.object({
  location: z.string().min(2, 'Location is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  season: z.string().min(2, 'Cropping season is required'),
  nitrogen: z.number().min(0, 'Nitrogen (N) must be ≥ 0 kg/ha').max(300, 'Nitrogen exceeds typical agricultural range (0-300 kg/ha)').optional().nullable(),
  phosphorus: z.number().min(0, 'Phosphorus (P) must be ≥ 0 kg/ha').max(200, 'Phosphorus exceeds typical range (0-200 kg/ha)').optional().nullable(),
  potassium: z.number().min(0, 'Potassium (K) must be ≥ 0 kg/ha').max(250, 'Potassium exceeds typical range (0-250 kg/ha)').optional().nullable(),
  // Optional parameters (supported by model / advice logic)
  ph: z.number().min(3.5, 'pH must be ≥ 3.5').max(10.0, 'pH must be ≤ 10.0').optional().nullable(),
  temperature: z.number().min(-10).max(60).optional().nullable(),
  humidity: z.number().min(0).max(100).optional().nullable(),
  rainfall: z.number().min(0).max(1000).optional().nullable(),
  soilMoisture: z.number().min(0).max(100).optional().nullable()
});

export const irrigationAdviceSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  location: z.string().min(2, 'Location is required'),
  growthStage: z.string().optional().default('Vegetative / Mid-season'),
  soilMoisture: z.number().min(0).max(100).optional().nullable(),
  recentRainfall: z.number().min(0).optional().nullable(),
  forecastRainChance: z.number().min(0).max(100).optional().nullable(),
  temperature: z.number().optional().nullable()
});

export const saveRecommendationSchema = z.object({
  farmId: z.string().optional().nullable(),
  crop: z.string().min(1, 'Crop is required'),
  modelStatus: z.enum(['demo', 'trained-model']),
  modelName: z.string(),
  confidence: z.number().nullable().optional(),
  explanation: z.array(z.string()),
  growingConditions: z.record(z.any()).optional().nullable(),
  inputs: z.record(z.any()),
  weatherSnapshot: z.record(z.any()).optional().nullable(),
  irrigationAdvice: z.record(z.any()).optional().nullable()
});

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorMessages
        });
      }
      next(error);
    }
  };
}
