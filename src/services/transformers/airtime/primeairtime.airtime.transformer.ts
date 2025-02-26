import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import Big from 'big.js';

export function primeairtimeAirtimeTransformer(data: any): FormattedProductInfo {
  let serviceData = {} as FormattedProductInfo;
  
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = data.products;
  
  const newArr = serviceData.products.map((element, index) => {
    const dataElement = data.products[index];
    return {
      currency: dataElement.currency,
      max_amount: (dataElement.openRangeMax).toString(),
      min_amount: "50",
      hasOpenRange: true,
      name: data.opts.operator,
      product_id: dataElement.product_id
    }
  });

  if(data?.validate) {
    const isFound = newArr.some(item => {
      if (item.product_id === data.product_id) {
        return true;
      }
      return false;
    }); 
    const result = Big(data?.amount).lte(newArr[0].max_amount) && Big(data?.amount).gte(newArr[0].min_amount);
    serviceData.valid = result && isFound
  }
    
  serviceData.products = newArr;
  return serviceData;
}
