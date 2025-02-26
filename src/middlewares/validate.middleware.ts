import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '../utils/ApiError';
import { LoggerClient } from '../services/logger.service';
import { Service } from 'typedi';

const logger = new LoggerClient();

@Service()
export default class RequestValidator {
  static validate = <T extends object>(classInstance: ClassConstructor<T>, value = "body") => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const convertedObject = plainToInstance(classInstance, req[value]);
      await validate(convertedObject).then((errors) => {
        if (errors.length > 0) {
          let rawErrors: string[] = [];
          for (const errorItem of errors) {
            rawErrors = rawErrors.concat(...rawErrors, Object.values(errorItem.constraints ?? []));
          }
          const validationErrorText = 'Request validation failed!';
          logger.error(rawErrors.toString());
          next(new ValidationError(validationErrorText, rawErrors));
        }
      });
      next();
    };
  };
}
