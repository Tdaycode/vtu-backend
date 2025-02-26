import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { primeairtimeInternetTransformer } from './primeairtime.internet.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class InternetTransformer {
  static transformers: TransformerRegister = {
    primeairtime: primeairtimeInternetTransformer,
  };

  static internet(rawData: ResponseObject, provider: string): FormattedProductInfo {
    const transFormer = InternetTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static getTransformer(factoryName: string) {
    const factory = InternetTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }

  static validate(rawData: ResponseObject, provider: string): boolean {
    const transFormer = InternetTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    if(transformedData?.valid === true) return true
    return false;
  }

  static isResponseFormatted(rawData: any): boolean {
    return (
      rawData.type && rawData.provider && rawData.products
    );
  }
}
