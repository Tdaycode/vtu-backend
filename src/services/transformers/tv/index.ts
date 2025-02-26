import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { primeairtimeTVTransformer } from './primeairtime.tv.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class TVTransformer {
  static transformers: TransformerRegister = {
    primeairtime: primeairtimeTVTransformer,
  };

  static tv(rawData: ResponseObject, provider: string): FormattedProductInfo {
    const transFormer = TVTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static getTransformer(factoryName: string) {
    const factory = TVTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }

  static validate(rawData: ResponseObject, provider: string): boolean {
    const transFormer = TVTransformer.getTransformer(provider);
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
