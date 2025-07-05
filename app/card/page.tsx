'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, ArrowLeft, Settings } from 'lucide-react';

function MembershipCardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [memberData, setMemberData] = useState({
    name: '',
    email: '',
    memberNumber: 'M-2025-0001',
    expirationDate: '2026年3月31日'
  });

  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    
    if (!name || !email) {
      router.push('/register');
      return;
    }

    setMemberData(prev => ({
      ...prev,
      name: name,
      email: email
    }));
  }, [searchParams, router]);

  const handleBack = () => {
    router.push('/');
  };

  const handleEditProfile = () => {
    const params = new URLSearchParams({
      name: memberData.name,
      email: memberData.email
    });
    router.push(`/profile?${params.toString()}`);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '/') + '時点';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-800 hover:bg-green-100 text-xs px-2 py-1"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                ホーム
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditProfile}
                className="text-gray-700 hover:text-gray-800 hover:bg-green-100 text-xs px-2 py-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                設定
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              <CreditCard className="h-5 w-5 text-green-700" />
              <h1 className="text-lg font-bold text-gray-700">スマート会員証</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto px-3 py-4">
        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-gray-700 mb-1">大分県音楽教会・スマート会員証</h2>
        </div>

        {/* Membership Card Image */}
        <div className="mb-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-green-200">
            <img 
              src="/IMG_7485.jpg" 
              alt="大分県音楽教会 会員証"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '1.6/1' }}
            />
          </div>
        </div>

        {/* Member Information */}
        <div className="space-y-3 mb-4">
          <div className="space-y-2 text-sm">
            <div className="text-right">
              <span className="text-gray-600 font-bold">有効期限 </span>
              <span className="text-gray-600 font-bold text-lg">{memberData.expirationDate}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-600 font-bold">会員ID </span>
              <span className="text-gray-600 font-bold font-mono text-lg">{memberData.memberNumber}</span>
            </div>
            <div>
              <div className="flex">
                <span className="text-gray-600 font-medium w-16">氏名</span>
                <span className="text-gray-600">{memberData.name}</span>
              </div>
            </div>
            <div>
              <div className="flex">
                <span className="text-gray-600 font-medium w-16">会員種別</span>
                <span className="text-gray-600">ダイヤモンド</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-gray-600 text-xs">{getCurrentDateTime()}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-200 mb-3">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              インターネットに接続できない環境で会員証を提示されたい場合には、下記ボタンを押し、画像として保存してご利用ください。
            </p>
            <Button 
              variant="outline" 
              className="w-full text-xs py-2 border-green-300 text-gray-700 hover:bg-green-50"
            >
              保存のため画像を表示する
            </Button>
          </CardContent>
        </Card>

        {/* Notice for Staff */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardContent className="p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">各支部・楽器店ご担当者様へ</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              こちらの「大分県音楽教会・スマート会員証」は、通常のカード型と同じ大分県音楽教会会員証として扱っていただくようお願い申し上げます。
            </p>
            <p className="text-xs text-gray-600">
              会員担当： member@piano.or.jp
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>mypage.piano.or.jp</p>
        </div>
      </main>
    </div>
  );
}

export default function MembershipCard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-2"></div>
          <p className="text-gray-700 text-sm">会員証を読み込み中...</p>
        </div>
      </div>
    }>
      <MembershipCardContent />
    </Suspense>
  );
}