export interface UserEntity {
  id: number;
  email: string;
  passwordHash: string;
  name: string | null;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: Date | null;
  createdAt: Date;
}