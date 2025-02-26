import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsValidCountryCode } from './IsValidCountryCode';

export class SearchProductQueryValidation {
  @IsNotEmpty()
  @IsString()
  searchTerm: string;

  @IsString()
  @IsOptional()
  @IsValidCountryCode()
  country: string
}

