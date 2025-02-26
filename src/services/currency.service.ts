import { Service } from 'typedi';
import Big from 'big.js';
import { LoggerClient } from './logger.service';
import { BadRequestError } from '../utils/ApiError';
import CurrencyRepository from '../repositories/currency.repository';
import { ExchangeRateProvider } from '../providers/exchangerate.provider';
import { ICurrencyTypes } from '../interfaces/currency.interface';

@Service()
export default class CurrencyService {
  constructor(
    public logger: LoggerClient, 
    public currencyRepository: CurrencyRepository,
    public exchangeRateProvider: ExchangeRateProvider
  ) {}

  getAllCurrency = async () => {
    return await this.currencyRepository.findAll();
  };

  public getCurrency = async (code: string) => {
    const response = await this.currencyRepository.findOne({ code });
    if (!response) throw new BadRequestError('Currency with the given credential does not exist.');
    return response;
  };

  updateCurrencyRate = async (code: string, rate: number, expires: Date = new Date()) => {
    const response = await this.currencyRepository.updateOne({ code }, { rate, expires });
    if (!response) throw new BadRequestError('Currency with the given credential does not exist.');
    return response;
  };

  convertLocalCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<string> => {
    try {
      // Get the exchange rates for both currencies
      const [fromRate, toRate] = await Promise.all([
        this.getCurrency(fromCurrency),
        this.getCurrency(toCurrency)
      ]);
  
      // Convert the amount using the exchange rates
      const convertedAmount = new Big(amount).times(toRate.rate).div(fromRate.rate);
  
      // Round the result to two decimal places
      return convertedAmount.toFixed(2);
    } catch (error) {
      console.log(error);
      throw new BadRequestError('Error occurred while fetching conversion rates');
    }
  }

  convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<string> => {
    const data = await this.exchangeRateProvider.getExchangeRate(`${fromCurrency},${toCurrency}`);
    const fromRate = new Big(data.rates[fromCurrency]);
    const toRate = new Big(data.rates[toCurrency]);
    const convertedAmount = new Big(amount).times(toRate).div(fromRate);
    return convertedAmount.toFixed(2);
  }

  convertNGNCurrency = async (amount: number, currency: string): Promise<string> => {
    try {
      // Get the exchange rates for both currencies
      const fromRate = await this.getCurrency(currency);
      const toRate = await this.exchangeRateProvider.retrieveNGNUSDRate();
      
      // Convert the amount using the exchange rates
      const convertedAmount = new Big(amount).times(toRate).div(fromRate.rate);
  
      // Round the result to two decimal places
      return convertedAmount.toFixed(2);
    } catch (error) {
      console.log(error);
      throw new BadRequestError('Error occurred while fetching conversion rates');
    }
  }

  convertToCowry = async (amount: number, currency: string): Promise<string> => {
    let amountUSD = amount;
    
    if (currency !== ICurrencyTypes.US_DOLLARS) {
      const convertFunction = currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
      const _amount = await this[convertFunction](amount, currency, ICurrencyTypes.US_DOLLARS);
      amountUSD = Number(_amount);
    }

    const amountCOY = await this.convertLocalCurrency(amountUSD, ICurrencyTypes.US_DOLLARS, ICurrencyTypes.COWRY);
    return amountCOY;
  }
}
