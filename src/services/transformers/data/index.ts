import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { primeairtimeDataTransformer } from './primeairtime.data.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class DataTransformer {
  static transformers: TransformerRegister = {
    primeairtime: primeairtimeDataTransformer,
  };

  static Data(rawData: ResponseObject, provider: string): FormattedProductInfo {
    const transFormer = DataTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static validate(rawData: ResponseObject, provider: string): boolean {
    const transFormer = DataTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    if(transformedData?.valid === true) return true
    return false;
  }

  static getTransformer(factoryName: string) {
    const factory = DataTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }

  static isResponseFormatted(rawData: any): boolean {
    return (
      rawData.type && rawData.provider && rawData.products
    );
  }
}
