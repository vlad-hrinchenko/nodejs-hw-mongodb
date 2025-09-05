import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    registerUserSchema,
    sendResetEmailSchema,
    resetPasswordSchema,
    verifyGoogleOAuthValidationSchema
} from '../validation/auth.js';
import {
    registerUserController,
    refreshUserController,
    logoutController,
    loginUserController,
    sendResetEmailController,
    resetPasswordController,
    getGoogleOauthSignInLinkController,
    verifyGoogleOAuthCodeController
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/authSchemas.js';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));
router.post('/logout', ctrlWrapper(logoutController));
router.post(
    '/send-reset-email',
    validateBody(sendResetEmailSchema),
    ctrlWrapper(sendResetEmailController),
);
router.post(
    '/reset-pwd',
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController),
);

router.post(
    '/get-google-oauth-url',
    ctrlWrapper(getGoogleOauthSignInLinkController),
);

router.post(
    '/verify-google-oauth-code',
    validateBody(verifyGoogleOAuthValidationSchema),
    ctrlWrapper(verifyGoogleOAuthCodeController),
);

export default router;