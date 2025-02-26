import Big from 'big.js';
import { BettingFormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { InterswitchCustomerValidationResponse } from '../../../interfaces/responses/interswitch.response.interface';

interface IinterswitchBettingTransformer extends InterswitchCustomerValidationResponse {
  type: string,
  provider: string,
  product_id: string,
  productName: string,
  validate: boolean,
  amount: string
}

export function interswitchBettingTransformer(data: IinterswitchBettingTransformer): BettingFormattedProductInfo {
  let serviceData = {} as BettingFormattedProductInfo;
  
  const billData = data.Customers[0];
  serviceData.type = data.type;
  serviceData.customerId = billData.CustomerId;
  serviceData.name = billData.FullName;
  serviceData.provider = data.provider;
  serviceData.products = [
    {
      currency: "NGN",
      max_amount: "10000000",
      min_amount: "100",
      hasOpenRange: true,
      name: data.productName,
      product_id: data?.product_id
    }
  ];

  if(data?.validate) {
    const result = Big(data?.amount).lte(serviceData.products[0].max_amount ?? 0) &&
     Big(data?.amount).gte(serviceData.products[0].min_amount ?? 0);
    serviceData.valid = result;
  }
  
  return serviceData;
}
