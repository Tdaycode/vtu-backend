import { IsNotEmpty, IsString, IsEnum, IsNumberString, IsOptional, IsBooleanString, IsNumber, IsBoolean } from 'class-validator';
import { SettingsType } from '../../interfaces/settings.interface';

export class UpdateSettingsValidation {
  @IsNotEmpty()
  @IsString()
  @IsEnum(SettingsType)
  type: SettingsType;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}

