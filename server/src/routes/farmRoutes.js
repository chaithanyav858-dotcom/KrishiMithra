import { Router } from 'express';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../controllers/farmController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, farmSchema } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);
router.get('/', getFarms);
router.post('/', validate(farmSchema), createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;
