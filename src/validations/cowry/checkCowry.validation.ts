import { IsNotEmpty, Length, IsString, IsEnum } from 'class-validator';

export class CheckCowryValidation {
  @IsNotEmpty()
  @IsString()
  @Length(16)
  code: string;
}

