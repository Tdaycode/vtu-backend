import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, IsMongoId, ValidateNested, IsNumberString, ValidateIf, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentOptions, PaymentTypes, ProductTypes } from '../../interfaces/product.interface';
import { IsValidCountryCode } from './IsValidCountryCode';
import { Discount, Provider, ServiceFee } from './product.validation';

export class EditProductValidation {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsNotEmpty()
  @IsEnum(ProductTypes)
  type: ProductTypes;
  
  @IsOptional()
  @ValidateIf(o => o.type === ProductTypes.GiftCard)
  @IsNumberString()
  minPrice?: number;

  @IsOptional()
  @ValidateIf(o => o.type === ProductTypes.GiftCard)
  @IsNumberString()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsEnum(PaymentTypes, { each: true })
  allowedPaymentOptions?: PaymentTypes[];

  @IsOptional()
  @IsEnum(PaymentOptions)
  paymentOptions?: PaymentOptions;

  @IsOptional()
  @IsArray()
  @IsValidCountryCode({ each: true })
  displayCountries?: string[];

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @Type(() => ServiceFee)
  @ValidateNested({ each: true })
  serviceFee?: ServiceFee;

  @IsOptional()
  @Type(() => Discount)
  @ValidateNested({ each: true })
  discount?: Discount;

  @IsOptional()
  @IsArray()
  @Type(() => Provider)
  @ValidateNested({ each: true })
  providers?: Provider[];
}