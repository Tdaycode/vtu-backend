import { Service } from 'typedi';
import { LoggerClient } from './logger.service';
import SettingsRepository from '../repositories/settings.repository';
import { ISettings, SettingsType } from '../interfaces/settings.interface';
import { settingsData } from '../utils/seedData';

type CredentialsData = Record<string, string | number | boolean>;

@Service()
export default class SettingsService {
  constructor(
    public logger: LoggerClient,
    public settingsRepository: SettingsRepository,
  ) { }

  createSettings = async (data: Partial<ISettings>) => {
    return await this.settingsRepository.create(data);
  };

  getSettingsByCredentials = async (data: CredentialsData) => {
    return await this.settingsRepository.find(data);
  };

  getOneSettingsByCredentials = async (data: CredentialsData) => {
    return await this.settingsRepository.findOne(data);
  };

  getSettingsByType = async (type: SettingsType) => {
    return await this.settingsRepository.findOne({ type });
  };

  updateSettingsByCredentials = async (type: SettingsType, data: CredentialsData) => {
    return await this.settingsRepository.updateOne({ type }, data);
  };
}
