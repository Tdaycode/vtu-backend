import { IsNotEmpty, IsString, IsEnum, ValidateIf } from 'class-validator';
import { TwoFATypes } from '../../interfaces/user.interface';

export class VerifyCodeValidation {
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
}
