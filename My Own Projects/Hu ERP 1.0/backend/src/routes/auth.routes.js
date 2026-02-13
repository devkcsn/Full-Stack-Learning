import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import * as authValidator from '../validators/auth.validator.js';

const router = express.Router();

// Public routes with rate limiting
router.post(
  '/register',
  authLimiter,
  validate(authValidator.registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate(authValidator.loginSchema),
  authController.login
);

router.post(
  '/send-otp',
  authLimiter,
  validate(authValidator.sendOtpSchema),
  authController.sendLoginOtp
);

router.post(
  '/login-with-otp',
  authLimiter,
  validate(authValidator.loginWithOtpSchema),
  authController.loginWithOtp
);

router.post(
  '/refresh',
  authLimiter,
  validate(authValidator.refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/forgot-password',
  authLimiter,
  validate(authValidator.forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  validate(authValidator.resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/verify-email',
  authLimiter,
  validate(authValidator.verifyEmailSchema),
  authController.verifyEmail
);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
