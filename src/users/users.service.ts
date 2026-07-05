import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

const publicUserSelect = {
  id: true,
  phone: true,
  email: true,
  name: true,
  role: true,
  region: true,
  isPhoneVerified: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: publicUserSelect });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: dto, select: publicUserSelect });
  }

  myListings(id: string) {
    return this.prisma.listing.findMany({
      where: { sellerId: id },
      include: { images: { orderBy: { order: 'asc' } }, documents: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
