import { IsOptional, IsEnum } from 'class-validator';
import { PaymentStatus, PaymentTypes } from '../../interfaces/payment.interface';
import { GetAllItemsValidation } from '../common/getAllItems.validation';

export class GetPaymentsValidation extends GetAllItemsValidation{
  @IsEnum(PaymentStatus)
  @IsOptional()
  status: PaymentStatus;

  @IsEnum(PaymentTypes)
  @IsOptional()
  paymentMethod: number;
}
