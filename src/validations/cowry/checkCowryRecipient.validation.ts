import { IsNotEmpty, IsString } from 'class-validator';

export class CheckCowryRecipientValidation {
  @IsNotEmpty()
  @IsString()
  userName: string;
}

