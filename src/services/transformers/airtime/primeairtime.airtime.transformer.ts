import { FormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import Big from 'big.js';
import { ProductIDs } from '../../../interfaces/product.interface';

export function primeairtimeAirtimeTransformer(data: any): FormattedProductInfo {
  let serviceData = {} as FormattedProductInfo;
  const isSmile = data?.product_id === ProductIDs.PRIME_AIRTIME_SMILE_RECHARGE;
  
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = data.products;
  
  const newArr = serviceData.products.map((element, index) => {
    const dataElement = data.products[index];
    return {
      currency: isSmile ? "NGN" : dataElement.currency,
      max_amount: isSmile ? dataElement?.max_denomination.toString() : (dataElement.openRangeMax).toString(),
      min_amount: isSmile ? dataElement?.min_denomination.toString() : "50",
      hasOpenRange: true,
      name: isSmile ? "Smile" : data.opts.operator,
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
