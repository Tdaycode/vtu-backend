import config from "../config/Config";
import { Service } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { UnAuthorizedError } from '../utils/ApiError';
import { LoggerClient } from '../services/logger.service';
import { BinancePayProvider } from '../providers/binancePay.provider';

@Service()
export default class WebhookMiddleware {
  constructor(public logger: LoggerClient, public binancePayProvider: BinancePayProvider) {}
  
  public validateIdentityPassWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadSignature = req.headers;
      console.log("payloadSignature", payloadSignature)
      // if(payloadSignature) {
      //   const publicKey = Buffer.from(payloadSignature.toString(), 'base64').toString('utf8');
      //   if (publicKey !== config.identityPassPublicKey) throw new Error('Request not from identity pass');
      // } else {
      //   next(new UnAuthorizedError('Unauthorized'));
      // }
   
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

  public validateBinancePayWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = req.headers;
      const valid = await this.binancePayProvider.verifyBinancePaySignature(headers, req.body);
      console.log(valid)
      // if(!valid) throw new Error("Unauthorized");
   
      next();
    } catch (err) {
      console.log(err)
      next(new UnAuthorizedError('Unauthorized'));
    }
  }

  public validateKudaWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadSignature = req.headers["password"];
      const payloadEmail = req.headers["username"];

      if(payloadSignature) {
        const publicKey = Buffer.from(payloadSignature.toString(), 'base64').toString('utf8');
        if(payloadEmail !== config.kudaEmail) throw new Error('Request not from Kuda');
        if(publicKey !== config.kudaPassword) throw new Error('Request not from Kuda');
      } else {
        next(new UnAuthorizedError('Unauthorized'));
      }
   
      next();
    } catch (err) {
      console.log(err)
      next(new UnAuthorizedError('Unauthorized'));
    }
  }
}