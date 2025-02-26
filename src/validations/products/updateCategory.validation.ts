import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryValidation {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}