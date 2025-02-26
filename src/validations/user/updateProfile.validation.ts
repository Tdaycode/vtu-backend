import { IsOptional, IsLowercase, Matches, MinLength } from 'class-validator';

export class UpdateProfileValidation {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsLowercase()
  @MinLength(6)
  @Matches(/^[^\s]+$/, {
    message: 'Username should be in lowercase and not contain any spaces',
  })
  userName: string;
}
