'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function DebugPage() {
  const [membersData, setMembersData] = useState<any>(null);
  const [passwordTest, setPasswordTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'yamada@example.com',
    password: 'member123'
  });

  const checkMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug/members');
      const data = await response.json();
      setMembersData(data);
    } catch (error) {
      console.error('Error checking members:', error);
      setMembersData({ error: 'Failed to fetch members' });
    } finally {
      setIsLoading(false);
    }
  };

  const testPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCredentials),
      });
      const data = await response.json();
      setPasswordTest(data);
    } catch (error) {
      console.error('Error testing password:', error);
      setPasswordTest({ error: 'Failed to test password' });
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: testCredentials.email,
          password: testCredentials.password,
        }),
      });
      const data = await response.json();
      console.log('Login test result:', data);
      alert(`Login test result: ${response.ok ? 'SUCCESS' : 'FAILED'}\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Error testing login:', error);
      alert(`Login test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          デバッグページ - データベース確認
        </h1>

        <div className="grid gap-6">
          {/* Members Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                会員データ確認
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={checkMembers} 
                disabled={isLoading}
                className="mb-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    確認中...
                  </>
                ) : (
                  '会員データを確認'
                )}
              </Button>

              {membersData && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(membersData, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                パスワード検証テスト
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={testPassword} 
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        テスト中...
                      </>
                    ) : (
                      'パスワード検証テスト'
                    )}
                  </Button>

                  <Button 
                    onClick={testLogin} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        テスト中...
                      </>
                    ) : (
                      'ログインテスト'
                    )}
                  </Button>
                </div>

                {passwordTest && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(passwordTest, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>デバッグ手順</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>まず「会員データを確認」ボタンをクリックして、データベースに会員データが存在するか確認</li>
                <li>「パスワード検証テスト」で、特定のユーザーのパスワードハッシュが正しく検証されるか確認</li>
                <li>「ログインテスト」で、実際のログインAPIが正常に動作するか確認</li>
                <li>ブラウザの開発者ツール（F12）でConsoleタブを開き、詳細なログを確認</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 