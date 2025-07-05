/**
 * 会員ステータス定数
 */
export const MEMBER_STATUS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  DIAMOND: 'diamond',
} as const;

/**
 * 会員ステータス表示名
 */
export const MEMBER_STATUS_LABELS = {
  [MEMBER_STATUS.BRONZE]: 'ブロンズ',
  [MEMBER_STATUS.SILVER]: 'シルバー',
  [MEMBER_STATUS.GOLD]: 'ゴールド',
  [MEMBER_STATUS.DIAMOND]: 'ダイヤモンド',
} as const;

/**
 * ログインタイプ定数
 */
export const LOGIN_TYPE = {
  WEB: 'web',
  MOBILE: 'mobile',
} as const;

/**
 * パスワード設定
 */
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 10,
} as const;

/**
 * 会員番号設定
 */
export const MEMBER_NUMBER_CONFIG = {
  PREFIX: 'M',
  YEAR_FORMAT: 'YYYY',
  SEQUENCE_LENGTH: 4,
} as const;

/**
 * 日付フォーマット
 */
export const DATE_FORMAT = {
  DISPLAY: 'YYYY年MM月DD日',
  ISO: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
} as const;

/**
 * API エンドポイント
 */
export const API_ENDPOINTS = {
  MEMBERS: '/api/members',
  ADMINS: '/api/admins',
  AUTH: '/api/auth',
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/profile',
  BENEFITS: '/api/benefits',
} as const;

/**
 * ページパス
 */
export const PAGES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CARD: '/card',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_BENEFITS: '/admin/benefits',
} as const;

/**
 * セッションキー
 */
export const SESSION_KEYS = {
  MEMBER_ID: 'member_id',
  ADMIN_ID: 'admin_id',
  LOGIN_TYPE: 'login_type',
} as const;

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'ログイン情報が正しくありません',
  MEMBER_NOT_FOUND: '会員が見つかりません',
  ADMIN_NOT_FOUND: '管理者が見つかりません',
  UNAUTHORIZED: 'ログインが必要です',
  FORBIDDEN: 'アクセス権限がありません',
  VALIDATION_ERROR: '入力内容に誤りがあります',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  EMAIL_ALREADY_EXISTS: 'このメールアドレスは既に登録されています',
  MEMBER_NUMBER_ALREADY_EXISTS: 'この会員番号は既に使用されています',
  PASSWORD_TOO_SHORT: `パスワードは${PASSWORD_CONFIG.MIN_LENGTH}文字以上で入力してください`,
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
  REQUIRED_FIELD: 'この項目は必須です',
} as const;

/**
 * 成功メッセージ
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'ログインしました',
  LOGOUT_SUCCESS: 'ログアウトしました',
  REGISTER_SUCCESS: '会員登録が完了しました',
  PROFILE_UPDATED: 'プロフィールを更新しました',
  PASSWORD_UPDATED: 'パスワードを更新しました',
  MEMBER_CREATED: '会員を作成しました',
  MEMBER_UPDATED: '会員情報を更新しました',
  MEMBER_DELETED: '会員を削除しました',
  BENEFITS_UPDATED: '特典を更新しました',
} as const;

/**
 * バリデーション設定
 */
export const VALIDATION_CONFIG = {
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  MEMBER_NUMBER_MAX_LENGTH: 20,
  BENEFIT_TITLE_MAX_LENGTH: 100,
  BENEFIT_DESCRIPTION_MAX_LENGTH: 1000,
  MAX_DISCOUNT_RATE: 100,
  MIN_DISCOUNT_RATE: 0,
} as const;

/**
 * アプリケーション設定
 */
export const APP_CONFIG = {
  ORGANIZATION_NAME: '大分県音楽教会',
  CONTACT_EMAIL: 'member@piano.or.jp',
  WEBSITE: 'mypage.piano.or.jp',
} as const; 