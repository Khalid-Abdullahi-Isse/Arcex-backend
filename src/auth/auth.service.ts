import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email.toLowerCase() }, { phone: dto.phone }],
      },
    });

    if (existing) {
      throw new ConflictException('Email or phone number is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: dto.role ?? UserRole.USER,
        isPhoneVerified: true,
      },
    });

    return this.issueTokens(user.id, user.phone, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const identifiers: Prisma.UserWhereInput[] = [];

    if (dto.email) identifiers.push({ email: dto.email.toLowerCase() });
    if (dto.phone) identifiers.push({ phone: dto.phone });

    if (identifiers.length === 0) {
      throw new BadRequestException('Email or phone number is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: identifiers,
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email, phone, or password');
    }

    return this.issueTokens(user.id, user.phone, user.email, user.role);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
      });
      return this.issueTokens(payload.sub, payload.phone, payload.email, payload.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async issueTokens(sub: string, phone: string, email: string, role: string) {
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
}
