declare class EnvironmentVariables {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRY: string;
    JWT_REFRESH_EXPIRY: string;
    S3_BUCKET: string;
    S3_REGION: string;
    SMS_API_KEY: string;
    NODE_ENV: 'development' | 'test' | 'production';
    PORT: number;
    CORS_ORIGIN: string;
    THROTTLE_TTL: number;
    THROTTLE_LIMIT: number;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariables;
export {};
