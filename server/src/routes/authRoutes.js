import { Router } from 'express';
import { register, login, demoLogin, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../middleware/validate.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/demo-login', demoLogin);
router.get('/me', authenticate, getCurrentUser);

export default router;
