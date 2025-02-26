import express from 'express';
import { Container } from 'typedi';
import WebhookMiddleware from '../middlewares/webhook.middleware';
import WebhookController from '../controllers/webhook.controller';

const router = express.Router();

const webhookController = Container.get(WebhookController);
const webhookMiddleware = Container.get(WebhookMiddleware); 

router.post('/flutterwave', webhookMiddleware.validateFlutterwaveWebhook, webhookController.handleFlutterwaveWebhook);
router.post('/binance-pay', webhookMiddleware.validateBinancePayWebhook, webhookController.handleBinancePayWebhook);
router.post('/identitypass', webhookMiddleware.validateIdentityPassWebhook, webhookController.handleIdentityPassWebhook);
router.post('/kuda', webhookMiddleware.validateKudaWebhook, webhookController.handleKudaWebhook);

export default router;
