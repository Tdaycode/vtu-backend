import { Document } from 'mongoose';

export interface IExchange {
  key: string;
  url: string;
  target: string[];
  method: string;
  payload: Object;
  mapResponse: string;
}

export interface ICache {
  key: string;
  data: string;
  updatedAt: Date,
  createdAt: Date
}

export interface IExchangeRate {
  currency: string;
  data: object;
  updatedAt: Date,
  createdAt: Date
}

export interface IErrorLog {
  error: string;
  url: string;
  body: string;
}

export interface IOldCachedRates {
  data: string;
  date: string;
  updatedAt: Date;
}

export interface ILogo {
  symbol: string;
  logo: string;
}

export interface IExchangeDocument extends IExchange, Document {}
export interface IExchangeRateDocument extends IExchangeRate, Document {}
export interface ICacheDocument extends ICache, Document {}
export interface IErrorLogDocument extends IErrorLog, Document {}
export interface IOldCachedRatesDocument extends IOldCachedRates, Document {}
export interface ILogoDocument extends ILogo, Document {}