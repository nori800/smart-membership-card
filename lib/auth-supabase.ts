import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Member } from '@/types/supabase';

/**
 * Supabase認証システムを使用した認証関数
 */

/**
 * メールアドレスとパスワードでログイン
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns ログイン結果
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return { success: false, error: error.message };
    }

    // 会員情報を取得
    const member = await getMemberByUserId(data.user.id);
    
    return { 
      success: true, 
      user: data.user, 
      session: data.session,
      member 
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ログインに失敗しました' 
    };
  }
};

/**
 * 会員登録
 * @param email - メールアドレス
 * @param password - パスワード
 * @param name - 名前
 * @returns 登録結果
 */
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    // 1. Supabase認証でユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase auth signup error:', authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'ユーザー作成に失敗しました' };
    }

    // 2. 会員番号生成
    const { data: memberNumber, error: memberNumberError } = await supabase
      .rpc('generate_member_number');

    if (memberNumberError || !memberNumber) {
      console.error('Member number generation error:', memberNumberError);
      return { success: false, error: '会員番号の生成に失敗しました' };
    }

    // 3. 会員情報をmembersテーブルに保存（password_hashは不要だがスキーマ上必須）
    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert({
        id: authData.user.id, // Supabase AuthのUIDを使用
        name,
        email,
        member_number: memberNumber,
        password_hash: 'supabase_auth', // Supabase認証を使用するためダミー値
        status: 'bronze',
        expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true,
      })
      .select()
      .single();

    if (memberError) {
      console.error('Member creation error:', memberError);
      return { success: false, error: '会員情報の作成に失敗しました' };
    }

    return { 
      success: true, 
      user: authData.user, 
      session: authData.session,
      member 
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '会員登録に失敗しました' 
    };
  }
};

/**
 * ログアウト
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ログアウトに失敗しました' 
    };
  }
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * 現在のセッションを取得
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Get current session error:', error);
    return null;
  }
};

/**
 * メールアドレスから会員情報を取得
 */
export const getMemberByEmail = async (email: string): Promise<Member | null> => {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Get member by email error:', error);
      return null;
    }

    return member;
  } catch (error) {
    console.error('Get member by email error:', error);
    return null;
  }
};

/**
 * ユーザーIDから会員情報を取得
 */
export const getMemberByUserId = async (userId: string): Promise<Member | null> => {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('auth_user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Get member by user ID error:', error);
      return null;
    }

    return member;
  } catch (error) {
    console.error('Get member by user ID error:', error);
    return null;
  }
};

/**
 * パスワードリセット
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'パスワードリセットに失敗しました' 
    };
  }
}; 