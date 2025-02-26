import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInValidation {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
