import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { UserEntity } from './entities/user.entity';
import { EmailService } from '../email/email.service';

const SALT_ROUNDS = 10;

export interface AuthResult {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export interface RegisterResult {
  userId: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResult> {
    const existing = await this.userRepository.findByEmail(registerDto.email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.userRepository.create(registerDto, passwordHash);
    await this.sendOtpToUser(user);

    return { userId: user.id, email: user.email };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(verifyOtpDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or OTP');
    }

    this.validateOtp(user, verifyOtpDto.otp);
    const verifiedUser = await this.userRepository.markVerified(user.id);
    await this.userRepository.clearOtp(user.id);

    return this.buildAuthResult(verifiedUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    return this.buildAuthResult(user);
  }

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<void> {
    const user = await this.userRepository.findByEmail(resendOtpDto.email);

    if (!user) {
      throw new UnauthorizedException('Email not registered');
    }

    await this.sendOtpToUser(user);
  }

  private async sendOtpToUser(user: UserEntity): Promise<void> {
    const otp = this.generateOtp();
    const expiresAt = this.getOtpExpiry();
    await this.userRepository.setOtp(user.id, otp, expiresAt);
    await this.emailService.sendOtp(user.email, otp);
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpExpiry(): Date {
    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES ?? 10);
    return new Date(Date.now() + ttlMinutes * 60 * 1000);
  }

  private validateOtp(user: UserEntity, otp: string): void {
    if (!user.otpCode || user.otpCode !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }
  }

  private buildAuthResult(user: UserEntity): AuthResult {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}