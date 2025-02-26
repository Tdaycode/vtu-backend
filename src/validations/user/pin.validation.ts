import { IsNotEmpty, Length } from 'class-validator';

export class SetupPinValidation {
  @IsNotEmpty()
  @Length(4,4)
  pin: string;
}
