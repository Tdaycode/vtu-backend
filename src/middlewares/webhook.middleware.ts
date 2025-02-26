import config from "../config/Config";
import { Service } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { UnAuthorizedError } from '../utils/ApiError';
import { LoggerClient } from '../services/logger.service';

@Service()
export default class WebhookMiddleware {
  constructor(public logger: LoggerClient) {}
  
  public validateIdentityPassWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadSignature = req.headers["x-identitypass-signature"];
      if(payloadSignature) {
        const publicKey = Buffer.from(payloadSignature.toString(), 'base64').toString('utf8');
        if (publicKey !== config.identityPassPublicKey) throw new Error('Request not from identity pass');
      } else {
        next(new UnAuthorizedError('Unauthorized'));
      }
   
      next();
    } catch (err) {
      console.log(err)
      next(new UnAuthorizedError('Unauthorized'));
    }
  }

  public validateFlutterwaveWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hash = req.headers["verif-hash"];
      if(!hash) throw new Error("Unauthorized");
      const secret_hash = config.flutterwaveSecretHash;
      if (secret_hash !== hash) throw new Error('Request not from flutterwave');
   
      next();
    } catch (err) {
      console.log(err)
      next(new UnAuthorizedError('Unauthorized'));
    }
  }
}