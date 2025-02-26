import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordValidation {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  verificationKey: string;

  @IsNotEmpty()
  password: string;
}
