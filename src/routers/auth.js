import express from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';

const router = express.Router();


router.post('/register', registerController);

router.post('/login', loginController);


router.post('/refresh', refreshController);


router.post('/logout', logoutController);

export default router;

