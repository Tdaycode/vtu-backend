import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { primeairtimeAirtimeTransformer } from '../airtime/primeairtime.airtime.transformer';
import { interswitchAirtimeTransformer } from '../airtime/interswitch.airtime.transformer';
import { Providers } from '../../../interfaces/product.interface';
import { valueTopUpAirtimeTransformer } from './valuetopup.airtime.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class AirtimeTransformer {
  static transformers: TransformerRegister = {
    [Providers.PrimeAirtime]: primeairtimeAirtimeTransformer,
    [Providers.Interswitch]: interswitchAirtimeTransformer,
    [Providers.ValueTopup]: valueTopUpAirtimeTransformer,
  };

  static airtime(rawData: ResponseObject, provider: string): FormattedProductInfo | boolean {
    const transFormer = AirtimeTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static validate(rawData: ResponseObject, provider: string): boolean {
    const transFormer = AirtimeTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    if(transformedData?.valid === true) return true
    return false;
  }

  static getTransformer(factoryName: string) {
    const factory = AirtimeTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }

  static isResponseFormatted(rawData: any): boolean {
    return (
      rawData.type && rawData.provider && rawData.products
    );
  }
}
