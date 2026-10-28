import { Router } from 'express';
import { handleGetWeather } from '../controllers/weatherController.js';

const router = Router();

router.get('/', handleGetWeather);

export default router;
