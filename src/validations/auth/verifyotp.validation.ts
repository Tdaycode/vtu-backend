import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { OTPTypes } from '../../interfaces/otp.interface';

export class VerifyOtpValidation {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  verificationKey: string;

  @IsNotEmpty()
  @IsString()
  entity: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(OTPTypes)
  type: OTPTypes;
}
