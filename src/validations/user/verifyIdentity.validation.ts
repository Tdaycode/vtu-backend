import { IsNotEmpty } from 'class-validator';

export class VerifyIdentityValidation {
  @IsNotEmpty()
  idType: string;

  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  imageBase64: string;
}
