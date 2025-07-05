import { z } from 'zod';
import { 
  PASSWORD_CONFIG, 
  VALIDATION_CONFIG, 
  ERROR_MESSAGES 
} from './constants';

/**
 * 会員ログインスキーマ
 */
export const memberLoginSchema = z.object({
  identifier: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, '入力が長すぎます'),
  password: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .min(PASSWORD_CONFIG.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
});

/**
 * 管理者ログインスキーマ
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, '入力が長すぎます'),
  password: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .min(PASSWORD_CONFIG.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
});

/**
 * 会員登録スキーマ
 */
export const memberRegistrationSchema = z.object({
  name: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_CONFIG.NAME_MAX_LENGTH, '名前が長すぎます'),
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, 'メールアドレスが長すぎます'),
  password: z
    .string()
    .min(PASSWORD_CONFIG.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
  confirmPassword: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  status: z
    .enum(['bronze', 'silver', 'gold', 'diamond'])
    .optional()
    .default('bronze'),
  expiration_date: z
    .string()
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

/**
 * 会員情報更新スキーマ
 */
export const memberUpdateSchema = z.object({
  name: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_CONFIG.NAME_MAX_LENGTH, '名前が長すぎます')
    .optional(),
  email: z
    .string()
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, 'メールアドレスが長すぎます')
    .optional(),
  currentPassword: z
    .string()
    .optional(),
  newPassword: z
    .string()
    .min(PASSWORD_CONFIG.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .optional(),
  confirmPassword: z
    .string()
    .optional(),
  status: z
    .enum(['bronze', 'silver', 'gold', 'diamond'])
    .optional(),
  expiration_date: z
    .string()
    .optional(),
}).refine((data) => {
  // パスワード変更時の検証
  if (data.newPassword || data.confirmPassword || data.currentPassword) {
    return data.currentPassword && 
           data.newPassword && 
           data.confirmPassword &&
           data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: 'パスワード変更時は現在のパスワード、新しいパスワード、確認用パスワードがすべて必要で、新しいパスワードが一致している必要があります',
  path: ['confirmPassword'],
});

/**
 * 会員特典スキーマ
 */
export const memberBenefitSchema = z.object({
  status: z.enum(['bronze', 'silver', 'gold', 'diamond']),
  title: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_CONFIG.BENEFIT_TITLE_MAX_LENGTH, 'タイトルが長すぎます'),
  description: z
    .string()
    .max(VALIDATION_CONFIG.BENEFIT_DESCRIPTION_MAX_LENGTH, '説明が長すぎます')
    .optional(),
  discount_rate: z
    .number()
    .min(VALIDATION_CONFIG.MIN_DISCOUNT_RATE, '割引率は0%以上である必要があります')
    .max(VALIDATION_CONFIG.MAX_DISCOUNT_RATE, '割引率は100%以下である必要があります')
    .optional()
    .nullable(),
  is_active: z
    .boolean()
    .optional()
    .default(true),
});

/**
 * 管理者作成スキーマ
 */
export const adminCreationSchema = z.object({
  name: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_CONFIG.NAME_MAX_LENGTH, '名前が長すぎます'),
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, 'メールアドレスが長すぎます'),
  password: z
    .string()
    .min(PASSWORD_CONFIG.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
  confirmPassword: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  is_active: z
    .boolean()
    .optional()
    .default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

/**
 * CSV一括登録スキーマ
 */
export const csvMemberSchema = z.object({
  name: z
    .string()
    .min(1, '名前は必須です')
    .max(VALIDATION_CONFIG.NAME_MAX_LENGTH, '名前が長すぎます'),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, 'メールアドレスが長すぎます'),
  member_number: z
    .string()
    .min(1, '会員番号は必須です')
    .max(VALIDATION_CONFIG.MEMBER_NUMBER_MAX_LENGTH, '会員番号が長すぎます')
    .optional(), // 自動生成の場合はオプション
  status: z
    .enum(['bronze', 'silver', 'gold', 'diamond'])
    .optional()
    .default('bronze'),
  expiration_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '有効期限はYYYY-MM-DD形式で入力してください'),
  password: z
    .string()
    .min(PASSWORD_CONFIG.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .optional(), // 自動生成の場合はオプション
});

/**
 * 検索・フィルタースキーマ
 */
export const memberSearchSchema = z.object({
  query: z
    .string()
    .optional(),
  status: z
    .enum(['bronze', 'silver', 'gold', 'diamond'])
    .optional(),
  is_active: z
    .boolean()
    .optional(),
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .default(20),
});

/**
 * 型エクスポート
 */
export type MemberLoginInput = z.infer<typeof memberLoginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type MemberRegistrationInput = z.infer<typeof memberRegistrationSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
export type MemberBenefitInput = z.infer<typeof memberBenefitSchema>;
export type AdminCreationInput = z.infer<typeof adminCreationSchema>;
export type CsvMemberInput = z.infer<typeof csvMemberSchema>;
export type MemberSearchInput = z.infer<typeof memberSearchSchema>; 