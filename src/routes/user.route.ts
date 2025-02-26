import express from 'express';
import {
  SetupPinValidation,
  UpdateProfileValidation,
  VerifyCodeValidation
} from '../validations/user';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import UserController from '../controllers/user.controller';
import WebhookMiddleware from '../middlewares/webhook.middleware';
import { GetAllItemsValidation } from '../validations/common/getAllItems.validation';

const router = express.Router();

const userController = Container.get(UserController);
const authMiddleware = Container.get(AuthMiddleware);
const webhookMiddleware = Container.get(WebhookMiddleware);

router.get('/', RequestValidator.validate(GetAllItemsValidation), userController.getAllUsers);
router.post('/verification', authMiddleware.user, userController.initiateCodeVerification);
router.patch('/pin', [authMiddleware.user, authMiddleware.verifyUsername, authMiddleware.verifyPhone, 
  RequestValidator.validate(SetupPinValidation)], userController.setupNewPin);
router.post('/pin', [authMiddleware.user, RequestValidator.validate(SetupPinValidation)], userController.verifyPin);
router.put('/pin', [authMiddleware.user, authMiddleware.verifyCode, RequestValidator.validate(VerifyCodeValidation),
  RequestValidator.validate(SetupPinValidation)], userController.updatePin);
router.get('/profile', authMiddleware.user, userController.getUserProfile);
router.put('/profile', authMiddleware.user, RequestValidator.validate(UpdateProfileValidation), userController.updateUserProfile);
router.post('/identity-webhook', [webhookMiddleware.validateIdentityPassWebhook, 
  authMiddleware.validateExistingUserIdentity], userController.verifyUserIdentity);
router.get('/all-users', [authMiddleware.user, authMiddleware.validateAdminUser], userController.getAllUsers)

export default router;
