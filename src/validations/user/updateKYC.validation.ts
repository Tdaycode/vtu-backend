import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsOptional, ValidateIf, IsArray, Validate, ValidateNested, IsNumberString, 
  ValidatorConstraint, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { KYCAction, KYCStatus } from '../../interfaces/kyc-upload.interface';
import { GetAllItemsValidation } from '../common/getAllItems.validation';

@ValidatorConstraint({ name: 'customString', async: false })
class IsCustomStringConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return value === 'unlimited' || typeof value === 'string' && !isNaN(Number(value));
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a number string or "unlimited" string.`;
  }
}

export class UpdateKYCValidation {
  @IsNotEmpty()
  @IsString()
  @IsEnum(KYCAction)
  action: KYCAction;

  @ValidateIf(o => o.action === KYCAction.Rejected)
  @IsNotEmpty()
  @IsString()
  rejectionReason: string;
}

export class UpdateKYCParamsValidation {
  @IsNotEmpty()
  @IsString()
  id: KYCAction;
}

export class GetKYCRequestsValidation extends GetAllItemsValidation {
  @IsOptional()
  @IsEnum(KYCStatus)
  status: KYCStatus;
}

class Limit {
  @IsNotEmpty()
  @IsNumberString()
  level: string;

  @IsNotEmpty()
  @IsString()
  dailyLimit: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsCustomStringConstraint)
  monthlyLimit: string;
}

export class UpdateKYCLimitsValidation {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Limit)
  limits: Limit[];
}
