import Big from 'big.js';
import { ElectricityFormattedProductInfo } from '../../../interfaces/formatted/product-info.interface';
import { InterswitchCustomerValidationResponse } from '../../../interfaces/responses/interswitch.response.interface';

interface IinterswitchElectricityTransformer extends InterswitchCustomerValidationResponse {
  type: string,
  provider: string,
  productName: string,
  validate: boolean,
  amount: string
}

export function interswitchElectricityTransformer(data: IinterswitchElectricityTransformer): ElectricityFormattedProductInfo {
  let serviceData = {} as ElectricityFormattedProductInfo;
     
  const billData = data.Customers[0];
  serviceData.type = data.type;
  serviceData.provider = data.provider;
  serviceData.products = [
    {
        "currency": "NGN",
        "max_amount": "300000",
        "min_amount": "1000",
        "hasOpenRange": true,
        "name": data.productName,
        product_id: billData.PaymentCode,
      }
  ];

  const customerInfo = {
    address: "Not Available",
    meterNumber: billData.CustomerId,
    vendType: "PostPaid/Prepaid",
    name: billData.FullName
  };
  serviceData.customerInfo = customerInfo;

  if(data?.validate) {
    const result = Big(data?.amount).lte(serviceData.products[0].max_amount ?? 0) && Big(data?.amount).gte(serviceData.products[0].min_amount ?? 0);
    serviceData.valid = result;
  }
    
  return serviceData;
}
