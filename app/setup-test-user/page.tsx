'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signUpWithEmail } from '@/lib/auth-supabase';
import { useRouter } from 'next/navigation';

export default function SetupTestUser() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createTestUser = async () => {
    setIsCreating(true);
    setMessage('');
    setError('');

    try {
      const result = await signUpWithEmail(
        'test@example.com',
        'test123456',
        'テストユーザー'
      );

      if (result.success) {
        setMessage('テストユーザーを作成しました！ test@example.com / test123456 でログインできます。');
      } else {
        setError(result.error || 'ユーザー作成に失敗しました');
      }
    } catch (error) {
      console.error('Create user error:', error);
      setError('ユーザー作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-700">テストユーザー作成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 space-y-2">
              <p>新しい認証システム用のテストユーザーを作成します：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>メール: test@example.com</li>
                <li>パスワード: test123456</li>
                <li>名前: テストユーザー</li>
              </ul>
            </div>

            <Button
              onClick={createTestUser}
              disabled={isCreating}
              className="w-full bg-green-700 hover:bg-green-800 text-white"
            >
              {isCreating ? '作成中...' : 'テストユーザーを作成'}
            </Button>

            <div className="text-center space-y-2">
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
                className="w-full"
              >
                ログインページに移動
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="w-full text-gray-600"
              >
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 