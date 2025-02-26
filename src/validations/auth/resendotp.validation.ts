import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { OTPTypes } from '../../interfaces/otp.interface';

export class ResendOtpValidation {
  @IsNotEmpty()
  @IsString()
  entity: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(OTPTypes)
  type: OTPTypes;
}
