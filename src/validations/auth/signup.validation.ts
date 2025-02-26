import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class SignUpValidation {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(2, 2)
  country: string;
}
