import { IsOptional } from 'class-validator';

export class UpdateProfileValidation {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  userName: string;
}
