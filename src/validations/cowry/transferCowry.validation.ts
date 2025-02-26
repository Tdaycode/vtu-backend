import { IsNotEmpty, Length, IsString } from 'class-validator';

export class TransferCowryValidation {
  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  recipient: string;

  @IsNotEmpty()
  @Length(4,4)
  pin: string;
}

