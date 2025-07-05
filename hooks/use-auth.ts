import { useState, useEffect, createContext, useContext } from 'react';
import { Database } from '@/types/supabase';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants';

type Member = Database['public']['Tables']['members']['Row'];

interface AuthContextType {
  member: Member | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 認証フック
 * @returns 認証状態と操作関数
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * 認証状態管理フック
 * @returns 認証状態と操作関数
 */
export const useAuthState = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージから会員情報を復元
  useEffect(() => {
    const savedMember = localStorage.getItem('member');
    if (savedMember) {
      try {
        setMember(JSON.parse(savedMember));
      } catch (error) {
        console.error('Failed to parse saved member data:', error);
        localStorage.removeItem('member');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * ログイン処理
   * @param identifier - 会員番号またはメールアドレス
   * @param password - パスワード
   * @returns ログイン結果
   */
  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || ERROR_MESSAGES.INVALID_CREDENTIALS };
      }

      // 会員情報をローカルストレージに保存
      setMember(data.member);
      localStorage.setItem('member', JSON.stringify(data.member));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 会員登録処理
   * @param data - 登録データ
   * @returns 登録結果
   */
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || ERROR_MESSAGES.SERVER_ERROR };
      }

      // 登録成功後、自動ログイン
      setMember(result.member);
      localStorage.setItem('member', JSON.stringify(result.member));

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ログアウト処理
   */
  const logout = () => {
    setMember(null);
    localStorage.removeItem('member');
  };

  /**
   * プロフィール更新処理
   * @param data - 更新データ
   * @returns 更新結果
   */
  const updateProfile = async (data: UpdateProfileData) => {
    if (!member) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, memberId: member.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || ERROR_MESSAGES.SERVER_ERROR };
      }

      // 更新された情報を取得
      const profileResponse = await fetch(`${API_ENDPOINTS.PROFILE}?id=${member.id}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setMember(profileData.member);
        localStorage.setItem('member', JSON.stringify(profileData.member));
      }

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    member,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
};

export { AuthContext };
export type { AuthContextType, RegisterData, UpdateProfileData }; 