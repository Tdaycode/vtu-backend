import { Request, Response } from 'express';
import { Service } from 'typedi';
import schedule from '../jobs/schedule';
import { BinancePayProvider } from '../providers/binancePay.provider';

@Service()
export default class WebhookController {
  constructor(
    public binancePayProvider: BinancePayProvider
  ) {
}

  public handleFlutterwaveWebhook = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      await schedule.processFlutterwaveWebhook(payload);
      return res.sendStatus(200);
    } catch (error) {
      console.log("error", error)
      res.sendStatus(400);
    }
  };

  public handleBinancePayWebhook = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      await schedule.processBinancePayWebhook(payload);
      const response = { "returnCode": "SUCCESS", "returnMessage" : null };
      return res.status(200).json(response);    
    } catch (error) {
      console.log("error", error)
      const response = { "returnCode": "FAIL", "returnMessage" : null };
      return res.status(200).json(response);
    }
  };

  public handleKudaWebhook = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      await schedule.processKudaTransactionWebhook(payload);
      return res.sendStatus(200);
    } catch (error) {
      console.log("error", error)
      res.sendStatus(400);
    }
  };

  public handleIdentityPassWebhook = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      await schedule.processIdentityPassWebhook(payload);
      return res.sendStatus(200);
    } catch (error) {
      console.log("error", error)
      res.sendStatus(400);
    }
  };
}
