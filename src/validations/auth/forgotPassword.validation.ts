import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordValidation {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
