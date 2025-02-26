import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsValidCountryCode } from './IsValidCountryCode';

export class CountryQueryValidation {
  @IsString()
  @IsOptional()
  @IsValidCountryCode()
  country: string
}

