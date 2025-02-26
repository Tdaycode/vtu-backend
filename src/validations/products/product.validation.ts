import { IsString, IsOptional, IsBoolean, IsEnum, IsNumberString } from 'class-validator';
import { DiscountAmountType, DiscountType, Providers, ServiceFeeAmountType, ServiceTypes } from '../../interfaces/product.interface';

export class ServiceFee {
  @IsOptional()
  @IsEnum(ServiceFeeAmountType)
  type: ServiceFeeAmountType;

  @IsOptional()
  @IsNumberString()
  value: number;

  @IsBoolean()
  active: boolean;
}

export class Provider {
  @IsEnum(Providers)
  name: Providers;

  @IsOptional()
  @IsString()
  productId: string;

  @IsOptional()
  @IsEnum(ServiceTypes)
  serviceId: ServiceTypes;

  @IsBoolean()
  active: boolean;
}

export class Discount {
  @IsOptional()
  @IsEnum(DiscountType)
  type: DiscountType;

  @IsOptional()
  @IsEnum(DiscountAmountType)
  mode: DiscountAmountType;

  @IsOptional()
  @IsNumberString()
  value: number;

  @IsBoolean()
  active: boolean;
}