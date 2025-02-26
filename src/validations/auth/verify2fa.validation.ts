import { IsString, IsNotEmpty, IsEnum, ValidateIf } from 'class-validator';
import { TwoFATypes } from '../../interfaces/user.interface';

export class Verify2faValidation {
    @IsNotEmpty()
    @IsString()
    @IsEnum(TwoFATypes)
    type: TwoFATypes;
  
    @IsString()
    @IsNotEmpty()
    otp: string;
  
    @ValidateIf(o => o.type === TwoFATypes.email)
    @IsNotEmpty()
    @IsString()
    verificationKey: string;
  
    @ValidateIf(o => o.type === TwoFATypes.totp)
    @IsNotEmpty()
    @IsString()
    secret: string;
}
