import { Router } from 'express';
import { getHistory, getHistoryById, saveRecommendation, deleteHistoryRecord } from '../controllers/historyController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, saveRecommendationSchema } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);
router.get('/', getHistory);
router.get('/:id', getHistoryById);
router.post('/save', validate(saveRecommendationSchema), saveRecommendation);
router.delete('/:id', deleteHistoryRecord);

export default router;
