import { TVFormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import Big from 'big.js';

export function primeairtimeTVTransformer(data: any): TVFormattedProductInfo {
  let serviceData = {} as TVFormattedProductInfo;

  if(data?.productName === "GOTV" || data?.productName === "DSTV") {
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
      name: data?.productName === "StarTimes" ? dataElement.name : dataElement.description,
      product_id: data?.productName === "StarTimes" ? dataElement.code : dataElement.product_id,
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
