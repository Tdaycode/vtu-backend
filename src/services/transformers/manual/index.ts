import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { NotFoundError } from '../../../utils/ApiError';
import { Providers } from '../../../interfaces/product.interface';
import { teleBankManualTransformer } from './telebank.manual.transformer';

type TransformerRegister = {
  [key: string]: (data: any) => FormattedProductInfo;
};

type ResponseObject = {
  [key: string]: any;
};

export class ManualProductTransformer {
  static transformers: TransformerRegister = {
    [Providers.TeleBank]: teleBankManualTransformer
  };

  static manual(rawData: ResponseObject, provider: string): FormattedProductInfo | boolean {
    const transFormer = ManualProductTransformer.getTransformer(provider);
    const transformedData = transFormer(rawData);
    return transformedData;
  }

  static getTransformer(factoryName: string) {
    const factory = ManualProductTransformer.transformers[factoryName];
    if (!factory) throw new NotFoundError('Transformer not found');
    return factory;
  }

  static isResponseFormatted(rawData: any): boolean {
    return (
      rawData.type && rawData.provider && rawData.products
    );
  }
}
