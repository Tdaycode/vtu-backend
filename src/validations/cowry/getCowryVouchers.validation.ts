import { IsOptional, IsBooleanString, IsString } from 'class-validator';
import { GetAllItemsValidation } from '../common/getAllItems.validation';

export class GetCowryVouchersValidation extends GetAllItemsValidation{
  @IsBooleanString()
  @IsOptional()
  isValid: string;

  @IsBooleanString()
  @IsOptional()
  disabled: string;

  @IsString()
  @IsOptional()
  code: string;
}
