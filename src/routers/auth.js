import express from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';

const router = express.Router();

// Реєстрація нового користувача
router.post('/register', registerController);

// Логін користувача
router.post('/login', loginController);

// Оновлення сесії (оновлення токенів)
router.post('/refresh', refreshController);

// Вихід користувача (видалення сесії)
router.post('/logout', logoutController);

export default router;
