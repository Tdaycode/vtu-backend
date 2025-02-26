import { Document } from 'mongoose';

export interface ISettings {
  type: SettingsType;
  value: number;
  active: boolean;
}

export enum SettingsType {
  globalDiscount = 'globalDiscount',
  disableRegistration = "disableRegistration",
}

export interface ISettingsDocument extends ISettings, Document {}
