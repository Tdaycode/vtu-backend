import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { interswitchElectricityTransformer } from './interswitch.electricity.transformer';
import { primeairtimeElectricityTransformer } from './primeairtime.electricity.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class ElectricityTransformer {
  static transformers: TransformerRegister = {
    primeairtime: primeairtimeElectricityTransformer,
    interswitch: interswitchElectricityTransformer,
  };

  static electricity(rawData: ResponseObject, provider: string): FormattedProductInfo {
    const transFormer = ElectricityTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static getTransformer(factoryName: string) {
    const factory = ElectricityTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }
  
  static validate(rawData: ResponseObject, provider: string): boolean {
    const transFormer = ElectricityTransformer.getTransformer(provider);
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
