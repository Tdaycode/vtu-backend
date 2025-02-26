import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import Big from 'big.js';

export function primeairtimeInternetTransformer(data: any): FormattedProductInfo {
  let serviceData = {} as FormattedProductInfo;
  
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = data.products;
  
  const newArr = serviceData.products.map((element, index) => {
    const dataElement = data.products[index];
    return {
      currency: dataElement.topup_currency,
      amount: (dataElement.topup_value).toString(),
      hasOpenRange: false,
      name: `${data.productName} - ${dataElement.name}`,
      product_id: dataElement.code
    }
  });

  if(data?.validate) {
    const isFound = newArr.some(item => {
      if (item.product_id === data.product_id &&
        Big(data?.amount).eq(item.amount)) {
        return true;
      }
      return false;
    }); 
    serviceData.valid = isFound
  }
  
  serviceData.products = newArr;
  return serviceData;
}
