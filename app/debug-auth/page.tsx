'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DebugAuthPage() {
  const [email, setEmail] = useState('yamada@example.com');
  const [password, setPassword] = useState('member123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/auth-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Test failed:', error);
      setResult({ error: 'Request failed', details: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>認証システムデバッグ</CardTitle>
          <CardDescription>新しいSupabase認証システムのテスト</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={testAuth} disabled={loading} className="w-full">
            {loading ? 'テスト中...' : '認証テスト実行'}
          </Button>

          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">テスト結果:</h3>
              
              {/* 直接認証テスト */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">1. 直接Supabase認証</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className={`p-2 rounded ${result.direct_auth?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>成功:</strong> {result.direct_auth?.success ? 'Yes' : 'No'}
                    </div>
                    {result.direct_auth?.error && (
                      <div className="p-2 bg-red-100 rounded">
                        <strong>エラー:</strong> {result.direct_auth.error}
                      </div>
                    )}
                    {result.direct_auth?.user && (
                      <div className="p-2 bg-blue-100 rounded">
                        <strong>ユーザー:</strong>
                        <pre className="text-sm mt-1">{JSON.stringify(result.direct_auth.user, null, 2)}</pre>
                      </div>
                    )}
                    <div className={`p-2 rounded ${result.direct_auth?.has_session ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <strong>セッション:</strong> {result.direct_auth?.has_session ? 'あり' : 'なし'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Membersテーブル */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2. Membersテーブル</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-100 rounded">
                      <strong>件数:</strong> {result.members_table?.count || 0}
                    </div>
                    {result.members_table?.error && (
                      <div className="p-2 bg-red-100 rounded">
                        <strong>エラー:</strong> {result.members_table.error}
                      </div>
                    )}
                    {result.members_table?.members && result.members_table.members.length > 0 && (
                      <div className="p-2 bg-blue-100 rounded">
                        <strong>データ:</strong>
                        <pre className="text-sm mt-1">{JSON.stringify(result.members_table.members, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SignIn関数テスト */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">3. SignIn関数テスト</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-2 bg-gray-100 rounded">
                    <pre className="text-sm">{JSON.stringify(result.signin_function, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>

              {/* 現在のユーザー */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">4. 現在のユーザーセッション</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.current_user?.error && (
                      <div className="p-2 bg-red-100 rounded">
                        <strong>エラー:</strong> {result.current_user.error}
                      </div>
                    )}
                    {result.current_user?.user ? (
                      <div className="p-2 bg-green-100 rounded">
                        <strong>ユーザー:</strong>
                        <pre className="text-sm mt-1">{JSON.stringify(result.current_user.user, null, 2)}</pre>
                      </div>
                    ) : (
                      <div className="p-2 bg-yellow-100 rounded">
                        <strong>ユーザー:</strong> なし
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 