import express from 'express';
import {
  SignInValidation,
  SignUpValidation,
  VerifyOtpValidation,
  ResendOtpValidation,
  VerifyPhoneOtpValidation,
  TwoFAValidation,
  Setup2faValidation,
  Verify2faValidation,
  ForgotPasswordValidation,
  ResetPasswordValidation,
  LogoutValidation,
  ChangePasswordValidation
} from '../validations/auth';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

const authController = Container.get(AuthController);
const authMiddleware = Container.get(AuthMiddleware);

router.post('/sign-up', RequestValidator.validate(SignUpValidation), authMiddleware.checkUserRegistrationStatus, authController.signUp);
router.post('/sign-in', RequestValidator.validate(SignInValidation), authController.signIn);
router.post('/logout', RequestValidator.validate(LogoutValidation), authController.logOut);
router.post('/refresh-token', RequestValidator.validate(LogoutValidation), authController.refreshToken);
router.post('/verify-otp', RequestValidator.validate(VerifyOtpValidation), authController.verifyOtp);
router.post('/resend-otp', RequestValidator.validate(ResendOtpValidation), authController.resendOtp);
router.post('/forgot-password', RequestValidator.validate(ForgotPasswordValidation), authController.forgotPassword);
router.post('/reset-password', RequestValidator.validate(ResetPasswordValidation), authController.resetPassword);
router.post('/change-password', authMiddleware.user, RequestValidator.validate(ChangePasswordValidation), authController.changePassword);
router.post('/twofa', RequestValidator.validate(TwoFAValidation), authController.completeTwoFA);
router.patch('/update-2fa', RequestValidator.validate(Setup2faValidation), authMiddleware.user, authController.updateTwoFA);
router.post('/phone-verify', authMiddleware.user, authController.phoneVerification);
router.patch('/phone-verify', authMiddleware.user, RequestValidator.validate(VerifyPhoneOtpValidation), authController.verifyPhoneOtp);
router.post('/verify-2fa', RequestValidator.validate(Verify2faValidation), authMiddleware.user, authController.verifyTwoFA);
router.get('/me', authMiddleware.user, authController.getCurrentUser);

export default router;
