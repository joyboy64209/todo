export interface UserEntity {
  id: number;
  email: string;
  passwordHash: string;
  name: string | null;
  createdAt: Date;
}