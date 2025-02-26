import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import config from '../config/Config';
import { LoggerClient } from '../services/logger.service';

const logger = new LoggerClient();

type CustomError = {
  success: boolean;
  message: string;
  errors: string[];
  stack?: string;
};

export default class ErrorHandler {
  static handle = () => {
    return async (err: ApiError, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      logger.error('error occurred: ' + err.toString() + ' ' + statusCode.toString());
      const data: CustomError = {
        success: false,
        message: err.message,
        errors: err.errors ?? [],
      };
      if (config.environment === 'development') data.stack = err.stack;
      res.status(statusCode).send(data);
    };
  };

  static initializeUnhandledException = () => {
    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
      logger.error(reason.name + ' ' + reason.message);
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      throw reason;
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error(err.name + ' ' + err.message);
      logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      process.exit(1);
    });
  };
}
