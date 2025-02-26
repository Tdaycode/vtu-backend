import { IsNotEmpty } from 'class-validator';

export class GetAvailablePaymentMethodsValidation {
  @IsNotEmpty()
  productCurrency: string;
}
