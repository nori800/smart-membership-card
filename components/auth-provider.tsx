'use client';

import { ReactNode } from 'react';
import { AuthContext, useAuthState } from '@/hooks/use-auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダー
 * アプリケーション全体に認証状態を提供する
 * @param children - 子コンポーネント
 * @returns JSX要素
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}; 