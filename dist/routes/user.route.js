"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../validations/user");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const typedi_1 = require("typedi");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const webhook_middleware_1 = __importDefault(require("../middlewares/webhook.middleware"));
const getAllItems_validation_1 = require("../validations/common/getAllItems.validation");
const router = express_1.default.Router();
const userController = typedi_1.Container.get(user_controller_1.default);
const authMiddleware = typedi_1.Container.get(auth_middleware_1.default);
const webhookMiddleware = typedi_1.Container.get(webhook_middleware_1.default);
router.get('/', validate_middleware_1.default.validate(getAllItems_validation_1.GetAllItemsValidation), userController.getAllUsers);
router.post('/verification', authMiddleware.user, userController.initiateCodeVerification);
router.patch('/pin', [authMiddleware.user, authMiddleware.verifyUsername, authMiddleware.verifyPhone,
    validate_middleware_1.default.validate(user_1.SetupPinValidation)], userController.setupNewPin);
router.post('/pin', [authMiddleware.user, validate_middleware_1.default.validate(user_1.SetupPinValidation)], userController.verifyPin);
router.put('/pin', [authMiddleware.user, authMiddleware.verifyCode, validate_middleware_1.default.validate(user_1.VerifyCodeValidation),
    validate_middleware_1.default.validate(user_1.SetupPinValidation)], userController.updatePin);
router.get('/profile', authMiddleware.user, userController.getUserProfile);
router.put('/profile', authMiddleware.user, validate_middleware_1.default.validate(user_1.UpdateProfileValidation), userController.updateUserProfile);
router.post('/identity-webhook', [webhookMiddleware.validateIdentityPassWebhook,
    authMiddleware.validateExistingUserIdentity], userController.verifyUserIdentity);
exports.default = router;
