import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsBooleanString, ValidateIf } from 'class-validator';
import { TwoFATypes } from '../../interfaces/user.interface';

export class TwoFAValidation {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TwoFATypes)
  type: TwoFATypes;

  @ValidateIf(o => o.type === TwoFATypes.email)
  @IsNotEmpty()
  @IsString()
  verificationKey: string;

  @IsOptional()
  @IsBooleanString()
  rememberMe: boolean
}
