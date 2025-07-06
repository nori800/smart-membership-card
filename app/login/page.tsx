'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail } from '@/lib/auth-supabase';
import { useAuth } from '@/hooks/use-auth-supabase';

// SearchParamsを使用するコンポーネントを分離
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const redirectTo = searchParams.get('redirectTo') || '/card';
  const message = searchParams.get('message');

  // 認証済みユーザーは会員証ページにリダイレクト
  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  // 登録成功メッセージの表示
  useEffect(() => {
    if (message === 'registration_success') {
      setSuccessMessage('会員登録が完了しました！ログインしてください。');
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        // 成功時は自動的にonAuthStateChangeでリダイレクトされる
        router.push(redirectTo);
      } else {
        setError(result.error || 'ログインに失敗しました');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ログインに失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-2"></div>
          <p className="text-gray-700 text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-8 w-8 text-green-700" />
            <h1 className="text-2xl font-bold text-gray-800">大分県音楽教会</h1>
          </div>
          <p className="text-gray-600">スマート会員証システム</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-700">ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="例: yamada@example.com"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">パスワード</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    required
                    className="border-green-200 focus:border-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 hover:bg-green-800 text-white"
              >
                {isSubmitting ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <button
                  onClick={handleRegister}
                  className="text-green-700 hover:text-green-800 text-sm font-medium underline"
                >
                  新規会員登録はこちら
                </button>
              </div>
              
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  ホームに戻る
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}

// メインコンポーネント - SuspenseでLoginContentをラップ
export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-2"></div>
            <p className="text-gray-700 text-sm">読み込み中...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}