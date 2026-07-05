import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    name: string;
    phone: string;
    email: string;
    password: string;
    role?: UserRole;
}
