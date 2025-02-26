import { IsNotEmpty } from 'class-validator';

export class FulfillOrderValidation {
  @IsNotEmpty()
  comment: string;
}

