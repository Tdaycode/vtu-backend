import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { interswitchBettingTransformer } from './interswitch.betting.transformer';
import { primeairtimeBettingTransformer } from './primeairtime.betting.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class BettingTransformer {
  static transformers: TransformerRegister = {
    primeairtime: primeairtimeBettingTransformer,
    interswitch: interswitchBettingTransformer,
  };

  static betting(rawData: ResponseObject, provider: string): FormattedProductInfo {
    const transFormer = BettingTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static validate(rawData: ResponseObject, provider: string): boolean {
    const transFormer = BettingTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    if(transformedData?.valid === true) return true
    return false;
  }

  static getTransformer(factoryName: string) {
    const factory = BettingTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }

  static isResponseFormatted(rawData: any): boolean {
    return (
      rawData.type && rawData.provider && rawData.products
    );
  }
}
