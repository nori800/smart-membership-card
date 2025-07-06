'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Users, Gift, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    // Routerが準備完了したことを確認
    if (router) {
      setIsRouterReady(true);
    }
  }, [router]);

  const handleLogin = () => {
    if (!isRouterReady) {
      // フォールバック: window.locationを使用
      window.location.href = '/login';
      return;
    }
    
    try {
      router.push('/login');
    } catch (error) {
      console.error('Navigation error:', error);
      // エラー時のフォールバック
      window.location.href = '/login';
    }
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
            <CreditCard className="h-8 w-8 text-green-700" />
            <h1 className="text-2xl font-bold text-gray-700">大分県音楽教会デジタル会員証</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            スマートな会員証体験を
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            スマートフォンで簡単に表示できるデジタル会員証。
            いつでもどこでも、会員特典をお楽しみください。
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            ログイン / 会員証を表示
          </Button>
        </div>

        {/* CTA Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-green-200">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            今すぐ始めましょう
          </h3>
          <p className="text-gray-600 mb-6">
            簡単な登録で、すぐにデジタル会員証をご利用いただけます。
          </p>
          <Button 
            onClick={handleRegister}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            会員証を取得する
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-green-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            © 2025 大分県音楽教会デジタル会員証システム. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}