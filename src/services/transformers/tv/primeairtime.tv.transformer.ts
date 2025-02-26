import { TVFormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import Big from 'big.js';
import { transformTVPackage } from '../../../utils/helpers';
import { ProductIDs } from '../../../interfaces/product.interface';

export function primeairtimeTVTransformer(data: any): TVFormattedProductInfo {
  let serviceData = {} as TVFormattedProductInfo;

  if(data?.product_id === ProductIDs.PRIME_AIRTIME_GOTV || 
    data?.product_id === ProductIDs.PRIME_AIRTIME_DSTV) {
    const customerInfo = {
      first_name: data.first_name,
      last_name: data.last_name,
      number: data.number,
      status: data.status,
      total_amount: data.total_amount,
      total_due_date: data.total_due_date,
      total_balance_due: data.total_balance_due,
      primary_product_id: data.primary_product_id,
      primary_product_name: data.primary_product_name,
      primary_product_price: data.primary_product_price,
      primary_product_currency: data.primary_product_currency
    };
    serviceData.customerInfo = customerInfo;
  }

  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = data.products;
  
  const newArr = serviceData.products.map((element, index) => {
    const dataElement = data.products[index];
    return {
      currency: dataElement.topup_currency,
      amount: dataElement.topup_value,
      hasOpenRange: false,
      name: data?.product_id === ProductIDs.PRIME_AIRTIME_SHOWMAX || ProductIDs.PRIME_AIRTIME_STARTIMES ? 
        transformTVPackage(dataElement.name, dataElement?.subscription_months) : dataElement.description,
      product_id: data?.productName === ProductIDs.PRIME_AIRTIME_SHOWMAX || ProductIDs.PRIME_AIRTIME_STARTIMES ? dataElement.code : dataElement.product_id,
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
