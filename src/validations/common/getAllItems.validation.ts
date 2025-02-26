import { IsOptional, IsString } from 'class-validator';

export class GetAllItemsValidation {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  searchTerm: string;
}

