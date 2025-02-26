import { IsNotEmpty, Length, IsString } from 'class-validator';
import { CheckCowryValidation } from './checkCowry.validation';

export class LoadCowryValidation extends CheckCowryValidation {
  @IsNotEmpty()
  @IsString()
  @Length(6)
  pin: string;
}

