import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import { GetAllItemsValidation } from '../validations/common/getAllItems.validation';
import WalletController from '../controllers/wallet.controller';

const router = express.Router();

const walletController = Container.get(WalletController);
const authMiddleware = Container.get(AuthMiddleware);

router.get('/transactions', authMiddleware.user, RequestValidator.validate(GetAllItemsValidation), walletController.getWalletTransactions);
router.get('/transactions/:id', authMiddleware.user, walletController.getSingleWalletTransaction);

export default router;