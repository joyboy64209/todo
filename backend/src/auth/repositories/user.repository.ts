import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(registerDto: RegisterDto, passwordHash: string): Promise<UserEntity> {
    return this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash,
        name: registerDto.name ?? null,
      },
    });
  }

  async setOtp(userId: number, otpCode: string, otpExpiresAt: Date): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { otpCode, otpExpiresAt },
    });
  }

  async clearOtp(userId: number): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { otpCode: null, otpExpiresAt: null },
    });
  }

  async markVerified(userId: number): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }
}