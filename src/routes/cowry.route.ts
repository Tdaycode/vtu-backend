import express from 'express';
import {
    LoadCowryValidation,
    CheckCowryValidation,
    TransferCowryValidation
} from '../validations/cowry';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import CowryController from '../controllers/cowry.controller';
import { responseType } from '../utils/helpers';
import { GetAllItemsValidation } from '../validations/common/getAllItems.validation';

const router = express.Router();

const cowryController = Container.get(CowryController);
const authMiddleware = Container.get(AuthMiddleware);

router.get('/view/:code', authMiddleware.user, RequestValidator.validate(CheckCowryValidation, responseType.params), cowryController.checkCowryVoucher);
router.post('/load', authMiddleware.user, RequestValidator.validate(LoadCowryValidation), cowryController.loadCowryVoucher);
router.post('/transfer', [authMiddleware.user, RequestValidator.validate(TransferCowryValidation), authMiddleware.verifyPin], cowryController.transferCowry);
router.get('/transactions', authMiddleware.user, RequestValidator.validate(GetAllItemsValidation), cowryController.getCowryTransactions);


export default router;
