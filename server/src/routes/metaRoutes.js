import { Router } from 'express';
import { SOIL_TYPES, SEASONS, DISTRICT_COORDINATES } from '../config/constants.js';

const router = Router();

router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      soilTypes: SOIL_TYPES,
      seasons: SEASONS,
      districts: Object.keys(DISTRICT_COORDINATES),
      demoMode: process.env.DEMO_MODE !== 'false',
      modelServiceConfigured: Boolean(process.env.MODEL_SERVICE_URL?.trim()),
      weatherProvider: process.env.WEATHER_PROVIDER || 'open-meteo'
    }
  });
});

export default router;
