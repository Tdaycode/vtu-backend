import { IsOptional, IsString } from 'class-validator';

export class GetOrdersValidation {
  @IsOptional()
  page: Number;

  @IsOptional()
  limit: Number;

  @IsString()
  @IsOptional()
  searchTerm: string;
}

