import { Request } from 'express';
import { Service } from 'typedi';
import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { SettingsService } from '../services';
import { UpdateSettingsValidation } from '../validations/settings';
import ExchangeRateService from '../services/exchange-rate.service';

@Service()
export default class SettingsController {
  constructor(
    public settingsService: SettingsService,
    public exchangeRateService: ExchangeRateService,
  ) {}

  public getSettings = asyncWrapper(async () => {
    const settings = await this.settingsService.getSettingsByCredentials({});
    return new SuccessResponse(settings, "Settings Fetched Successfully");
  });

  public getRates = asyncWrapper(async () => {
    const rates = await this.exchangeRateService.getCurrencyExchangeRate();
    return new SuccessResponse(rates, "Rates Fetched Successfully");
  });

  public updateRates = asyncWrapper(async () => {
    const rates = await this.exchangeRateService.updateCurrencyExchangeRate();
    return new SuccessResponse(rates, "Rates Updated Successfully");
  });

  public updateSettings = asyncWrapper(async (req: Request) => {
    const { type, active, value } = req.body as UpdateSettingsValidation;
    const transactions = await this.settingsService.updateSettingsByCredentials(type, { active, value });
    return new SuccessResponse(transactions, "Settings Updated Successfully");
  });

}
