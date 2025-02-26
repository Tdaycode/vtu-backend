import { IsOptional, IsEnum, IsDateString, IsBooleanString } from 'class-validator';
import { OrderStatus } from '../../interfaces/order.interface';

export class GetOrdersStatsValidation {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsBooleanString()
  monthly: boolean;
}

