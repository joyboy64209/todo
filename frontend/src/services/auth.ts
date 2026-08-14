import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  RegisterResponse,
  VerifyOtpInput,
  ResendOtpInput,
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'todo_access_token';

function extractMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const message = (data as { message?: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && message.length > 0) return String(message[0]);
  return null;
}

export const authService = {
  async register(input: RegisterInput): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(extractMessage(data) ?? 'Registration failed');
    }

    return response.json();
  },

  async verifyOtp(input: VerifyOtpInput): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(extractMessage(data) ?? 'Invalid verification code');
    }

    return response.json();
  },

  async resendOtp(input: ResendOtpInput): Promise<void> {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(extractMessage(data) ?? 'Failed to resend code');
    }
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(extractMessage(data) ?? 'Invalid credentials');
    }

    return response.json();
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};