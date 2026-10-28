import { Router } from 'express';
import { handlePredictCrop } from '../controllers/predictionController.js';
import { validate, cropPredictionSchema } from '../middleware/validate.js';

const router = Router();

// Allows prediction both for authenticated users and exploratory use
router.post('/crop', validate(cropPredictionSchema), handlePredictCrop);

export default router;
