import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import SettingsController from '../controllers/settings.controller';
import { UpdateSettingsValidation } from '../validations/settings';

const router = express.Router();

const settingsController = Container.get(SettingsController);
const authMiddleware = Container.get(AuthMiddleware);

router.get('/', authMiddleware.validateAdminUser, settingsController.getSettings);
router.get('/rates', settingsController.getRates);
router.get('/rates/update', settingsController.updateRates);
router.patch('/', authMiddleware.validateAdminUser, RequestValidator.validate(UpdateSettingsValidation),  settingsController.updateSettings);

export default router; 