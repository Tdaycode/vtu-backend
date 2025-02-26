import { IsString, IsOptional, IsEnum, IsArray, IsMongoId, ValidateNested, IsNumberString, IsNotEmpty, IsISO4217CurrencyCode, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentOptions, PaymentTypes } from '../../interfaces/product.interface';
import { IsValidCountryCode } from './IsValidCountryCode';
import { Discount, ServiceFee } from './product.validation';

export class CreateProductValidation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string; 

  @IsNotEmpty()
  @IsString()
  label: string;
  
  @IsNotEmpty()
  @IsNumberString()
  minPrice: number;

  @IsNotEmpty()
  @IsNumberString()
  maxPrice: number;

  @IsNotEmpty()
  @IsString()
  @IsISO4217CurrencyCode()
  currency: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(PaymentTypes, { each: true })
  allowedPaymentOptions: PaymentTypes[];

  @IsNotEmpty()
  @IsEnum(PaymentOptions)
  paymentOptions: PaymentOptions;

  @IsNotEmpty()
  @IsArray()
  @IsValidCountryCode({ each: true })
  displayCountries: string[];

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsOptional()
  @Type(() => ServiceFee)
  @ValidateNested({ each: true })
  serviceFee?: ServiceFee;

  @IsOptional()
  @Type(() => Discount)
  @ValidateNested({ each: true })
  discount?: Discount;
}