import { Exchange, OldCachedRates, CachedData, ErrorLog, Logo, ExchangeRate } from '../models/currency-converter.model';
import { Service } from 'typedi';
import { AbstractRepository } from './abstract.repository';
import { IExchangeDocument, ICacheDocument, IErrorLogDocument,  IOldCachedRatesDocument, ILogoDocument, IExchangeRateDocument } from '../interfaces/currency-converter.interface';

@Service()
export class ExchangeRepository extends AbstractRepository<IExchangeDocument> {
  constructor() {
    super(Exchange);
  }
}

@Service()
export class ExchangeRateRepository extends AbstractRepository<IExchangeRateDocument> {
  constructor() {
    super(ExchangeRate);
  }
}

@Service()
export class CachedDataRepository extends AbstractRepository<ICacheDocument> {
  constructor() {
    super(CachedData);
  }
}

@Service()
export class OldCachedRatesRepository extends AbstractRepository<IOldCachedRatesDocument> {
  constructor() {
    super(OldCachedRates);
  }

  async getLastRate() {
    const lastRate = await OldCachedRates.findOne({}).sort({ updatedAt: -1 }).lean();
    return lastRate;
  }
}

@Service()
export class ErrorLogRepository extends AbstractRepository<IErrorLogDocument> {
  constructor() {
    super(ErrorLog);
  }
}

@Service()
export class LogoRepository extends AbstractRepository<ILogoDocument> {
  constructor() {
    super(Logo);
  }
}
