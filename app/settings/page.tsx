'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  LogOut,
  Settings as SettingsIcon,
  Bell,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-supabase';

/**
 * 設定ページコンポーネント
 * 会員情報の変更、パスワード変更、アプリ設定を提供
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, member, isLoading, signOut } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    darkMode: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * 認証状態の確認とメンバー情報の設定
   */
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirectTo=/settings');
      return;
    }

    if (member) {
      setFormData(prev => ({
        ...prev,
        name: member.name || '',
        email: member.email || ''
      }));
    }
  }, [user, member, isLoading, router]);

  /**
   * 入力値の変更を処理
   * @param {React.ChangeEvent<HTMLInputElement>} e - 入力イベント
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // 成功メッセージをクリア
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /**
   * 設定値の変更を処理
   * @param {string} key - 設定キー
   * @param {boolean} value - 設定値
   */
  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * フォームのバリデーション
   * @returns {boolean} - バリデーション結果
   */
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = '氏名を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // パスワード変更時のバリデーション
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '現在のパスワードを入力してください';
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = '新しいパスワードを入力してください';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'パスワードは6文字以上で入力してください';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * フォームの送信処理
   * @param {React.FormEvent} e - フォームイベント
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 実際のAPIエンドポイントに送信
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // パスワードフィールドをクリア
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccessMessage('設定を保存しました');
      
      // 3秒後に成功メッセージを消去
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Settings update error:', error);
      setErrors({ submit: '設定の保存に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 会員証ページに戻る
   */
  const handleBack = () => {
    try {
      router.push('/card');
    } catch (error) {
      console.error('Router navigation error:', error);
      window.location.href = '/card';
    }
  };

  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-2"></div>
          <p className="text-gray-700 text-sm">設定を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user || !member) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-800 hover:bg-green-100"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                会員証に戻る
              </Button>
              <div className="flex items-center space-x-2 ml-4">
                <SettingsIcon className="h-8 w-8 text-green-700" />
                <h1 className="text-2xl font-bold text-gray-700">設定</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            アカウント設定
          </h2>
          <p className="text-gray-600">
            会員情報の変更やアプリの設定を行えます
          </p>
        </div>

        {/* 成功メッセージ */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* エラーメッセージ */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{errors.submit}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* 会員情報 */}
          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-700 flex items-center">
                <User className="h-5 w-5 mr-2" />
                会員情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 氏名 */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    お名前 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="山田 太郎"
                    className={`w-full px-4 py-3 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg ${
                      errors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* メールアドレス */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    メールアドレス <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                    className={`w-full px-4 py-3 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg ${
                      errors.email ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* パスワード変更セクション */}
                <div className="pt-4">
                  <Separator className="mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    パスワード変更
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    パスワードを変更しない場合は、以下のフィールドは空のままにしてください
                  </p>

                  {/* 現在のパスワード */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                      現在のパスワード
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="現在のパスワードを入力"
                        className={`w-full px-4 py-3 pr-12 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg ${
                          errors.currentPassword ? 'border-red-300' : ''
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* 新しいパスワード */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                      新しいパスワード
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="新しいパスワードを入力"
                        className={`w-full px-4 py-3 pr-12 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg ${
                          errors.newPassword ? 'border-red-300' : ''
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* パスワード確認 */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      新しいパスワード（確認）
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="新しいパスワードを再度入力"
                        className={`w-full px-4 py-3 pr-12 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg ${
                          errors.confirmPassword ? 'border-red-300' : ''
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* 保存ボタン */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* アプリ設定 */}
          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-700 flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                アプリ設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 通知設定 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-gray-700 font-medium">通知</p>
                    <p className="text-sm text-gray-500">重要な情報をお知らせします</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              {/* オートセーブ設定 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Save className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-gray-700 font-medium">オートセーブ</p>
                    <p className="text-sm text-gray-500">会員証画像を自動で保存します</p>
                  </div>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 