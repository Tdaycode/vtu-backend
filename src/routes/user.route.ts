import express from 'express';
import {
  SetupPinValidation,
  UpdateProfileValidation,
  VerifyCodeValidation,
  UpdateKYCValidation,
  UpdateKYCParamsValidation,
  GetKYCRequestsValidation,
  UpdateKYCLimitsValidation
} from '../validations/user';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import UserController from '../controllers/user.controller';
import { upload, uploadKYCDocument } from '../middlewares/upload.middleware';
import { GetAllItemsValidation } from '../validations/common/getAllItems.validation';
import { responseType } from '../utils/helpers';

const router = express.Router();

const userController = Container.get(UserController);
const authMiddleware = Container.get(AuthMiddleware); 

router.get('/', [RequestValidator.validate(GetAllItemsValidation), authMiddleware.validateAdminUser], userController.getAllUsers);
router.post('/verification', authMiddleware.user, userController.initiateCodeVerification);
router.post('/upload-file', authMiddleware.validateAdminUser, upload.single("file"), userController.uploadFile);
router.patch('/pin', [authMiddleware.user, authMiddleware.verifyUsername, authMiddleware.verifyPhone, 
  RequestValidator.validate(SetupPinValidation)], userController.setupNewPin);
router.post('/pin', [authMiddleware.user, RequestValidator.validate(SetupPinValidation)], userController.verifyPin);
router.put('/pin', [authMiddleware.user, authMiddleware.verifyCode, RequestValidator.validate(VerifyCodeValidation),
  RequestValidator.validate(SetupPinValidation)], userController.updatePin);
router.get('/profile', authMiddleware.user, userController.getUserProfile);
router.get('/kyc/documents', [authMiddleware.validateAdminUser, 
  RequestValidator.validate(GetKYCRequestsValidation)], userController.getAllKYCRequests);
router.get('/kyc/documents/:id', authMiddleware.validateAdminUser, userController.getSingleKYCRequest);
router.patch('/kyc/:id/document', [authMiddleware.validateAdminUser, 
  RequestValidator.validate(UpdateKYCParamsValidation, responseType.params), 
  RequestValidator.validate(UpdateKYCValidation)], userController.updateKYCDocument);
router.post('/kyc/document', authMiddleware.user, uploadKYCDocument, userController.uploadKYCDocument);
router.get('/kyc/document', authMiddleware.user, userController.getKYCDocument);
router.get('/kyc/levels', authMiddleware.validateAdminUser, userController.getKYCLevels);
router.put('/kyc/levels/limit', [authMiddleware.validateAdminUser, 
  RequestValidator.validate(UpdateKYCLimitsValidation)], userController.updateKYCLimits);
router.put('/profile', authMiddleware.user, RequestValidator.validate(UpdateProfileValidation), userController.updateUserProfile);
router.get('/all', authMiddleware.validateAdminUser, userController.getAllUsers);
router.get('/:id', authMiddleware.validateAdminUser, userController.getSingleUser);
router.patch('/disable/spend/:id', authMiddleware.validateAdminUser, userController.disableSpend);
router.patch('/disable/:id', authMiddleware.validateAdminUser, userController.disableAccount);

export default router;
