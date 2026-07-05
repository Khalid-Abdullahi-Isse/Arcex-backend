"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email.toLowerCase() }, { phone: dto.phone }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Email or phone number is already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                email: dto.email.toLowerCase(),
                passwordHash,
                role: dto.role ?? client_1.UserRole.USER,
                isPhoneVerified: true,
            },
        });
        return this.issueTokens(user.id, user.phone, user.email, user.role);
    }
    async login(dto) {
        const identifiers = [];
        if (dto.email)
            identifiers.push({ email: dto.email.toLowerCase() });
        if (dto.phone)
            identifiers.push({ phone: dto.phone });
        if (identifiers.length === 0) {
            throw new common_1.BadRequestException('Email or phone number is required');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: identifiers,
            },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid email, phone, or password');
        }
        return this.issueTokens(user.id, user.phone, user.email, user.role);
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
            });
            return this.issueTokens(payload.sub, payload.phone, payload.email, payload.role);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async issueTokens(sub, phone, email, role) {
        const payload = { sub, phone, email, role };
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET ?? 'dev-secret',
                expiresIn: '15m',
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
                expiresIn: '30d',
            }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map