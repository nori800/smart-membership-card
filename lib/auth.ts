import bcrypt from 'bcryptjs';
import { supabase } from './supabase';
import { Database } from '@/types/supabase';

type Member = Database['public']['Tables']['members']['Row'];
type Admin = Database['public']['Tables']['admins']['Row'];

/**
 * パスワードをハッシュ化する
 * @param password - 平文パスワード
 * @returns ハッシュ化されたパスワード
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * パスワードを検証する
 * @param password - 平文パスワード
 * @param hash - ハッシュ化されたパスワード
 * @returns 検証結果
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password.trim(), hash);
};

/**
 * 会員ログイン
 * @param identifier - メールアドレスまたは会員番号
 * @param password - パスワード
 * @returns 会員情報またはnull
 */
export const loginMember = async (
  identifier: string,
  password: string
): Promise<Member | null> => {
  try {
    console.log('=== loginMember function called ===');
    console.log('Identifier:', identifier);
    console.log('Password length:', password.length);

    // メールアドレスか会員番号かを判定
    const isEmail = identifier.includes('@');
    console.log('Is email:', isEmail);

    let query = supabase
      .from('members')
      .select('*')
      .eq('is_active', true);

    if (isEmail) {
      query = query.eq('email', identifier);
      console.log('Searching by email:', identifier);
    } else {
      query = query.eq('member_number', identifier);
      console.log('Searching by member_number:', identifier);
    }

    const { data: member, error } = await query.single();
    console.log('Database query result:');
    console.log('- Error:', error);
    console.log('- Member found:', !!member);
    
    if (member) {
      console.log('- Member details:', {
        id: member.id,
        email: member.email,
        name: member.name,
        member_number: member.member_number,
        status: member.status,
        is_active: member.is_active
      });
    }

    if (error) {
      console.error('Database error in loginMember:', error);
      return null;
    }

    if (!member) {
      console.log('No member found with identifier:', identifier);
      return null;
    }

    // パスワード検証
    console.log('Verifying password...');
    console.log('Stored hash length:', member.password_hash.length);
    console.log('Hash starts with:', member.password_hash.substring(0, 10));
    
    const isValidPassword = await verifyPassword(password, member.password_hash);
    console.log('Password verification result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password verification failed');
      return null;
    }

    console.log('Login successful for member:', member.email);
    return member;
  } catch (error) {
    console.error('Login member error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return null;
  }
};

/**
 * 管理者ログイン
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns 管理者情報またはnull
 */
export const loginAdmin = async (
  email: string,
  password: string
): Promise<Admin | null> => {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return null;
    }

    // パスワード検証
    const isValidPassword = await verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      return null;
    }

    return admin;
  } catch (error) {
    console.error('Admin login error:', error);
    return null;
  }
};

/**
 * 会員情報を取得
 * @param memberId - 会員ID
 * @returns 会員情報またはnull
 */
export const getMember = async (memberId: string): Promise<Member | null> => {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .eq('is_active', true)
      .single();

    if (error || !member) {
      return null;
    }

    return member;
  } catch (error) {
    console.error('Get member error:', error);
    return null;
  }
};

/**
 * 会員情報を更新
 * @param memberId - 会員ID
 * @param updates - 更新データ
 * @returns 更新結果
 */
export const updateMember = async (
  memberId: string,
  updates: Partial<Pick<Member, 'name' | 'email' | 'password_hash'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', memberId);

    return !error;
  } catch (error) {
    console.error('Update member error:', error);
    return false;
  }
};

/**
 * 新規会員登録
 * @param memberData - 会員データ
 * @returns 登録された会員情報またはnull
 */
export const registerMember = async (memberData: {
  name: string;
  email: string;
  password: string;
  status?: 'bronze' | 'silver' | 'gold' | 'diamond';
  expiration_date?: string;
}): Promise<Member | null> => {
  try {
    // パスワードハッシュ化
    const password_hash = await hashPassword(memberData.password);

    // 会員番号生成
    const { data: memberNumber, error: memberNumberError } = await supabase
      .rpc('generate_member_number');

    if (memberNumberError || !memberNumber) {
      console.error('Member number generation error:', memberNumberError);
      return null;
    }

    // デフォルト有効期限（1年後）
    const expiration_date = memberData.expiration_date || 
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 会員登録
    const { data: member, error } = await supabase
      .from('members')
      .insert({
        name: memberData.name,
        email: memberData.email,
        member_number: memberNumber,
        password_hash,
        status: memberData.status || 'bronze',
        expiration_date,
        is_active: true,
      })
      .select()
      .single();

    if (error || !member) {
      console.error('Member registration error:', error);
      return null;
    }

    return member;
  } catch (error) {
    console.error('Register member error:', error);
    return null;
  }
};

/**
 * ログイン履歴を記録
 * @param memberId - 会員ID
 * @param loginType - ログインタイプ
 * @param ipAddress - IPアドレス（オプション）
 * @param userAgent - ユーザーエージェント（オプション）
 */
export const logLoginHistory = async (
  memberId: string,
  loginType: 'web' | 'mobile',
  ipAddress?: string,
  userAgent?: string
): Promise<void> => {
  try {
    await supabase
      .from('login_logs')
      .insert({
        member_id: memberId,
        login_type: loginType,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
  } catch (error) {
    console.error('Login history error:', error);
  }
};

/**
 * 会員ステータスに応じた特典を取得
 * @param status - 会員ステータス
 * @returns 特典リスト
 */
export const getMemberBenefits = async (
  status: 'bronze' | 'silver' | 'gold' | 'diamond'
): Promise<Array<{
  title: string;
  description: string;
  discount_rate: number | null;
}>> => {
  try {
    const { data: benefits, error } = await supabase
      .from('member_benefits')
      .select('title, description, discount_rate')
      .eq('status', status)
      .eq('is_active', true)
      .order('created_at');

    if (error) {
      console.error('Get benefits error:', error);
      return [];
    }

    return benefits || [];
  } catch (error) {
    console.error('Get member benefits error:', error);
    return [];
  }
}; 