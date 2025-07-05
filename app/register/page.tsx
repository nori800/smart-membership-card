'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, ArrowLeft, User, Mail, Lock, Crown, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statusOptions = [
    { value: 'bronze', label: 'ブロンズ', description: '基本会員' },
    { value: 'silver', label: 'シルバー', description: '準プレミアム会員' },
    { value: 'gold', label: 'ゴールド', description: 'プレミアム会員' },
    { value: 'diamond', label: 'ダイヤモンド', description: '最上級会員' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // エラーをクリア
    if (error) setError('');
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // バリデーション
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.status) {
      setError('すべての項目を入力してください。');
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('会員登録が完了しました！ログインページに移動します...');
        
        // 2秒後にログインページに遷移
        setTimeout(() => {
          router.push('/login?message=registration_success');
        }, 2000);
      } else {
        setError(data.error || '登録に失敗しました。');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('サーバーエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/');
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
            新規会員登録
          </h2>
          <p className="text-gray-600">
            デジタル会員証の発行に必要な情報をご入力ください。
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-700">
              会員情報入力
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Name Input */}
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
                  className="w-full px-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                  required
                />
              </div>

              {/* Email Input */}
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
                  placeholder="yamada@example.com"
                  className="w-full px-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  パスワード <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="6文字以上で入力してください"
                    className="w-full px-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500">パスワードは6文字以上で入力してください</p>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center">
                  <Crown className="h-4 w-4 mr-2" />
                  会員ステータス <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full px-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500 rounded-lg">
                    <SelectValue placeholder="ステータスを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-sm text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Privacy Notice */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong>プライバシーについて：</strong>
                  入力された情報は会員証の表示およびサービス提供のためのみに使用されます。
                  個人情報は適切に保護されます。
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    登録中...
                  </span>
                ) : (
                  '会員登録する'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                既にアカウントをお持ちですか？{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-green-700 hover:text-green-800 font-medium underline"
                >
                  ログインはこちら
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              会員登録後について
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              会員登録完了後は、ログインしてスマートフォンの画面を店舗スタッフに提示することで、
              選択されたステータスに応じた会員特典をご利用いただけます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}