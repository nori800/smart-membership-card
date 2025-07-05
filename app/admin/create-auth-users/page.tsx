'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateAuthUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // 単一ユーザー作成
  const [singleEmail, setSingleEmail] = useState('');
  const [singlePassword, setSinglePassword] = useState('member123');

  // 一括作成
  const [bulkPassword, setBulkPassword] = useState('member123');

  const createSingleUser = async () => {
    if (!singleEmail) {
      setError('メールアドレスを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: singleEmail,
          password: singlePassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setSingleEmail('');
      } else {
        setError(data.error || 'ユーザー作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('サーバーエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const createAllUsers = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/auth/create-all-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultPassword: bulkPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || '一括作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating all users:', error);
      setError('サーバーエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理画面に戻る
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>認証ユーザー作成</span>
            </CardTitle>
            <CardDescription>
              既存のmembersテーブルのユーザーに対してSupabase認証ユーザーを作成し、紐付けます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">単一ユーザー作成</TabsTrigger>
                <TabsTrigger value="bulk">一括作成</TabsTrigger>
              </TabsList>

              {/* 単一ユーザー作成 */}
              <TabsContent value="single" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>単一ユーザー作成</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="single-email">メールアドレス</Label>
                        <Input
                          id="single-email"
                          type="email"
                          value={singleEmail}
                          onChange={(e) => setSingleEmail(e.target.value)}
                          placeholder="yamada@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="single-password">パスワード</Label>
                        <Input
                          id="single-password"
                          type="password"
                          value={singlePassword}
                          onChange={(e) => setSinglePassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={createSingleUser} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? '作成中...' : '認証ユーザー作成'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 一括作成 */}
              <TabsContent value="bulk" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>一括作成</span>
                    </CardTitle>
                    <CardDescription>
                      membersテーブルの全てのアクティブなユーザーに対して認証ユーザーを作成します
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bulk-password">デフォルトパスワード</Label>
                      <Input
                        id="bulk-password"
                        type="password"
                        value={bulkPassword}
                        onChange={(e) => setBulkPassword(e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        全ユーザーに同じパスワードを設定します
                      </p>
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        この操作は元に戻せません。実行前に必ずバックアップを取ってください。
                      </AlertDescription>
                    </Alert>
                    <Button 
                      onClick={createAllUsers} 
                      disabled={loading}
                      className="w-full"
                      variant="destructive"
                    >
                      {loading ? '作成中...' : '全ユーザーの認証ユーザー作成'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* エラー表示 */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* 結果表示 */}
            {result && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>実行結果</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.results ? (
                    // 一括作成の結果
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {result.results.total}
                          </div>
                          <div className="text-sm text-gray-500">総数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {result.results.created}
                          </div>
                          <div className="text-sm text-gray-500">作成</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {result.results.already_exists}
                          </div>
                          <div className="text-sm text-gray-500">既存</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {result.results.errors}
                          </div>
                          <div className="text-sm text-gray-500">エラー</div>
                        </div>
                      </div>

                      {result.details && result.details.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold">詳細結果:</h4>
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {result.details.map((detail: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{detail.email}</span>
                                <Badge variant={detail.status === 'created' ? 'default' : 'secondary'}>
                                  {detail.status === 'created' ? '作成済み' : '既存'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.errors && result.errors.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-red-600">エラー詳細:</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {result.errors.map((error: any, index: number) => (
                              <div key={index} className="p-2 bg-red-50 rounded">
                                <div className="text-sm font-medium">{error.email}</div>
                                <div className="text-xs text-red-600">{error.error}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // 単一作成の結果
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 rounded">
                        <div className="font-semibold text-green-800">作成成功!</div>
                        <div className="text-sm text-green-700">
                          {result.member?.name} ({result.member?.email}) の認証ユーザーを作成しました
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Auth User ID: {result.auth_user?.id}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 