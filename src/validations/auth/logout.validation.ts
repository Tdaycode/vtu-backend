import { IsNotEmpty } from 'class-validator';

export class LogoutValidation {
  @IsNotEmpty()
  refreshToken: string;
}
