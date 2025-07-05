'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection } from '@/lib/supabase';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    setErrorMessage('');

    try {
      const isConnected = await testSupabaseConnection();
      if (isConnected) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        setErrorMessage('Supabaseへの接続に失敗しました。環境変数を確認してください。');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Supabase接続をテスト中...';
      case 'success':
        return 'Supabase接続成功！';
      case 'error':
        return 'Supabase接続エラー';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          デジタル会員証システム - 接続テスト
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectionStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">エラー詳細:</h3>
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {connectionStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-800 mb-2">接続成功!</h3>
                <p className="text-green-700 text-sm">
                  Supabaseデータベースに正常に接続できました。
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">環境変数チェック:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={testConnection} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    テスト中...
                  </>
                ) : (
                  '再テスト'
                )}
              </Button>
            </div>

            {connectionStatus === 'error' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">解決方法:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>`.env.local` ファイルがプロジェクトルートに存在することを確認</li>
                  <li>Supabaseダッシュボードから正しいURL・キーをコピー</li>
                  <li>環境変数を設定後、開発サーバーを再起動</li>
                  <li>データベースのテーブルが正しく作成されていることを確認</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 