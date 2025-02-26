import { IsNotEmpty, IsString, IsEnum, ValidateIf, Length } from 'class-validator';
import { PaymentTypes } from '../../interfaces/payment.interface';
import { CreateOrderValidation } from '../order';

export class CreatePaymentValidation extends CreateOrderValidation {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentTypes)
  type: PaymentTypes;

  @ValidateIf(o => o.type === PaymentTypes.Cowry)
  @IsNotEmpty()
  @IsString()
  @Length(4,4)
  pin: string;
}

