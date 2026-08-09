import type { ReactNode } from 'react';
import { useAuthContext } from '../auth/AuthContext';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}