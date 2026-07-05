import { plainToInstance, Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsUrl({
    require_tld: false,
    protocols: ['postgresql', 'postgres'],
    require_protocol: true,
  })
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_EXPIRY!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRY!: string;

  @IsString()
  @IsNotEmpty()
  S3_BUCKET!: string;

  @IsString()
  @IsNotEmpty()
  S3_REGION!: string;

  @IsString()
  @IsNotEmpty()
  SMS_API_KEY!: string;

  @IsIn(['development', 'test', 'production'])
  NODE_ENV!: 'development' | 'test' | 'production';

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  THROTTLE_TTL!: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  THROTTLE_LIMIT!: number;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
    forbidUnknownValues: true,
  });

  const origins = String(config.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const hasWildcardOrigin = origins.includes('*');
  const malformedOrigins = origins.filter((origin) => {
    try {
      new URL(origin);
      return false;
    } catch {
      return true;
    }
  });

  if (validatedConfig.NODE_ENV === 'production' && hasWildcardOrigin) {
    throw new Error('CORS_ORIGIN cannot include "*" in production.');
  }

  if (origins.length === 0 || malformedOrigins.length > 0) {
    throw new Error(
      `CORS_ORIGIN must be a comma-separated list of valid URL origins. Invalid values: ${malformedOrigins.join(
        ', ',
      )}`,
    );
  }

  if (errors.length > 0) {
    const messages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'invalid value';
        return `${error.property}: ${constraints}`;
      })
      .join('; ');

    throw new Error(`Environment validation failed: ${messages}`);
  }

  return validatedConfig;
}
