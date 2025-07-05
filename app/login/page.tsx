'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, ArrowLeft, User, Mail, LogIn, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('すべての項目を入力してください。');
      return;
    }

    const result = await login(formData.identifier, formData.password);
    
    if (result.success) {
      router.push('/card');
    } else {
      setError(result.error || 'ログインに失敗しました。');
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-700 hover:text-gray-800 hover:bg-green-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              戻る
            </Button>
            <div className="flex items-center space-x-2 ml-4">
              <CreditCard className="h-8 w-8 text-green-700" />
              <h1 className="text-2xl font-bold text-gray-700">デジタル会員証</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            ログイン
          </h2>
          <p className="text-gray-600">
            会員番号またはメールアドレスとパスワードを入力してください。
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-700 flex items-center justify-center">
              <LogIn className="h-6 w-6 mr-2" />
              会員ログイン
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identifier Input */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-gray-700 font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  会員番号またはメールアドレス
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="M-2024-0001 または yamada@example.com"
                  className="w-full px-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  パスワード
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="パスワードを入力してください"
                  className="w-full px-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ログイン中...
                  </span>
                ) : (
                  '会員証を表示'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-3">
                まだ会員登録がお済みでない方は
              </p>
              <Button
                variant="outline"
                onClick={handleRegister}
                className="border-green-300 text-gray-700 hover:bg-green-50"
              >
                新規会員登録はこちら
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              ログインについて
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              会員登録時に発行された会員番号またはメールアドレスと、
              設定されたパスワードを入力してください。
              ログイン後、デジタル会員証が表示されます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}