import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { IProductDocument } from '../../../interfaces/product.interface';

interface ITeleBankManualTransformer {
  type: string,
  provider: string,
  productName: string,
  product: IProductDocument
}

export function teleBankManualTransformer(data: ITeleBankManualTransformer): FormattedProductInfo {
  let serviceData = {} as FormattedProductInfo;
  
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = [
    {
      currency: data.product.currency,
      hasOpenRange: false,
      name: data.productName,
      product_id: data.product._id.toString()
    }
  ];
  
  return serviceData;
}
