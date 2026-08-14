import { useCallback, useState } from 'react';
import { authService } from '../services/auth';
import type { LoginInput, RegisterInput, User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(input);
      authService.setToken(result.accessToken);
      setUser(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(input);
      return result.email;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.verifyOtp({ email, otp });
      authService.setToken(result.accessToken);
      setUser(result.user);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resendOtp({ email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearToken();
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = Boolean(user) || Boolean(authService.getToken());

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };
}