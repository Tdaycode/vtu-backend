import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TwoFATypes } from '../../interfaces/user.interface';

export class Setup2faValidation {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TwoFATypes)
  type: TwoFATypes;
}
