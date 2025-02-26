import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import Big from 'big.js';
import { dataConversion } from '../../../utils/helpers';

export function primeairtimeDataTransformer(data: any): FormattedProductInfo {
  let serviceData = {} as FormattedProductInfo;
  
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = data.products;
  
  const newArr = serviceData.products.map((element, index) => {
    const dataElement = data.products[index];
    return {
      currency: dataElement.currency,
      amount: (dataElement.denomination).toString(),
      hasOpenRange: false,
      name: dataConversion(dataElement.data_amount, dataElement.validity),
      product_id: dataElement.product_id
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
