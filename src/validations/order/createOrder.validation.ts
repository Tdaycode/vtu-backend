import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ElectricityType } from '../../interfaces/product.interface';

export class CreateOrderValidation {
  @IsNotEmpty()
  productID: string;

  @IsNotEmpty()
  product_id: string;

  @IsNotEmpty()
  recipient: string;

  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  @IsEnum(ElectricityType)
  electricityType: ElectricityType;
}

