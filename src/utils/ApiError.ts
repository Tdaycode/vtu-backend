import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  statusCode: number;
  errors: string[] = [];
  constructor(statusCode: number, message: string, errors?: string[]) {
    super(message);

    this.statusCode = statusCode;
    if (errors) this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `The requested path ${path} not found!`);
  }
}

export class NotFoundDocError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, errors: string[]) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, message, errors);
  }
}

export class ApplicationError extends ApiError {
  constructor(message: string, errors?: string[]) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}

export class UnAuthorizedError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.FORBIDDEN, message);
  }
}
