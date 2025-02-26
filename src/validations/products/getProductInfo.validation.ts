import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsValidCountryCode } from './IsValidCountryCode';

export class GetProductInfoQueryValidation {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  receipient: string;

  @IsString()
  @IsOptional()
  @IsValidCountryCode()
  country: string
}

export class GetProductInfoParamsValidation {
  @IsNotEmpty()
  id: string;
}

