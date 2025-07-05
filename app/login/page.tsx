'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, ArrowLeft, User, Mail, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('すべての項目を入力してください。');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to card page with user data
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email
    });
    
    router.push(`/card?${params.toString()}`);
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
            会員情報を入力して、デジタル会員証を表示してください。
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  お名前
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
                  メールアドレス
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
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
              会員登録時に入力されたお名前とメールアドレスを入力してください。
              ログイン後、デジタル会員証が表示されます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}