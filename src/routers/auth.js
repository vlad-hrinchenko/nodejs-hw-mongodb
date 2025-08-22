import express from 'express';
import Joi from 'joi';
import { register, login } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { refresh } from '../controllers/auth.js';

const router = express.Router();

// Схема реєстрації
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Схема логіну
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Роут реєстрації
router.post('/register', validateBody(registerSchema), register);

// Роут логіну
router.post('/login', validateBody(loginSchema), login);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;
