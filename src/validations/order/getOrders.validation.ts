import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '../../interfaces/order.interface';
import { GetAllItemsValidation } from '../common/getAllItems.validation';

export class GetOrdersValidation extends GetAllItemsValidation {
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}

