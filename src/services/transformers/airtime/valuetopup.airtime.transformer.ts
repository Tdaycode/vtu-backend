import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { IProduct } from '../../../interfaces/product.interface';
import Big from 'big.js';

interface IValidationData {
  type: string;
  provider: string;
  amount: number;
  productName: string;
  product_id: string;
  validate: boolean;
  product: IProduct
}

export function valueTopUpAirtimeTransformer(data: IValidationData): FormattedProductInfo {
  const { product, product_id } = data;
  let serviceData = {} as FormattedProductInfo;
  
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = [
    {
      currency: product.currency,
      max_amount: product.maxPrice?.toString(),
      min_amount : product.minPrice?.toString(),
      hasOpenRange: product.maxPrice !== product.minPrice,
      name: data.productName,
      product_id: product_id
    }
  ];

  if(data?.validate) {
    serviceData.valid = true;
    const _product = serviceData.products[0];
    if(_product?.max_amount && _product?.min_amount) {
      const result = Big(data?.amount).lte(_product.max_amount) && Big(data?.amount).gte(_product.min_amount);
      serviceData.valid = result;
    }
  }
  
  return serviceData;
}
