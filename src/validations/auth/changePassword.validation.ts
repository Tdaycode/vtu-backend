import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordValidation {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
