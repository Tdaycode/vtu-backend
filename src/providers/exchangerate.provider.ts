import moment from 'moment';
import { HttpClient } from '../utils/http-client.util';
import config from '../config/Config';
import { Service } from 'typedi';
import { ExchangeRateResponse, BinanceRateResponse, LunoRateResponse, QuidaxRateResponse } from '../interfaces/responses/exchangerate.response.interface';
import CurrencyRepository from '../repositories/currency.repository';
import { BadRequestError } from '../utils/ApiError';

@Service()
export class ExchangeRateProvider {
  constructor(
    public currencyRepository: CurrencyRepository,
  ) { }

  public async getExchangeRate(currency: string) {
    const url = `${config.openExchangeRateBaseUrl}/latest.json?app_id=${config.openExchangeRateAppId}&symbols=${currency}`;
    const response = await new HttpClient(url).get<ExchangeRateResponse>('');
    return response;
  }

  private async getBinanceNGNUSDRate() {
    const url = "https://api4.binance.com/api/v3/ticker/bookTicker?symbol=USDTNGN";
    const response = await new HttpClient(url).get<BinanceRateResponse>('');
    return parseFloat(response.askPrice);
  }

  private async getQuidaxNGNUSDRate() {
    const url = "https://www.quidax.com/api/v1/markets/tickers/usdtngn";
    const response = await new HttpClient(url).get<QuidaxRateResponse>('');
    return parseFloat(response.data.ticker.sell);
  }

  private async getLunoNGNUSDRate() {
    const url = "https://api.luno.com/api/1/ticker?pair=USDCNGN";
    const response = await new HttpClient(url).get<LunoRateResponse>('');
    return parseFloat(response.ask);
  }

  private async getNGNUSDRate(): Promise<number> {
    const [quidaxRate, lunoRate] = await Promise.all([
      this.getQuidaxNGNUSDRate(),
      this.getLunoNGNUSDRate(),
    ]);
    const highestRate = Math.max(quidaxRate, lunoRate);
    const rate = Math.ceil(highestRate / 5) * 5
    return parseFloat(rate.toFixed(2));
  }

  private async updateNGNRate(rate: number) {
    const expires = (moment().add(5, 'minutes')).toDate();
    await this.currencyRepository.updateOne({ code: "NGN" }, { rate, expires });
  }

  public async retrieveNGNUSDRate() {
    const response = await this.currencyRepository.findOne({ code: "NGN" });
    if(!response) throw new BadRequestError("Cannot fetch currency by credentials")
    const expiryDate = new Date(response.expires);
    
    if (expiryDate > new Date()) {
      return response.rate;
    } else {
      const rate = await this.getNGNUSDRate();
      await this.updateNGNRate(rate);
      return rate;
    }
  }
}