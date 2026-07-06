import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'isNotFutureIsoDate', async: false })
class IsNotFutureIsoDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) && date.getTime() <= Date.now();
  }

  defaultMessage() {
    return 'saleDate must not be in the future';
  }
}

function normalizePhone(value: unknown) {
  if (typeof value !== 'string') return value;
  const parsed = parsePhoneNumberFromString(value, 'SO');
  return parsed?.isValid() ? parsed.number : value.trim();
}

export class MarkListingSoldDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  salePrice: number;

  @IsISO8601({ strict: true })
  @Validate(IsNotFutureIsoDateConstraint)
  saleDate: string;

  @IsString()
  @MinLength(2)
  paymentMethod: string;

  @IsOptional()
  @IsString()
  documentReference?: string;

  @IsString()
  @MinLength(2)
  buyerName: string;

  @Transform(({ value }) => normalizePhone(value))
  @IsString()
  @IsPhoneNumber()
  @MinLength(8)
  buyerPhone: string;

  @IsOptional()
  @IsEmail()
  buyerEmail?: string;
}
