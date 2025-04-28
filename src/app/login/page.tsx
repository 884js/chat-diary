'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// エラーメッセージマッピング
const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed: 'X認証のコールバック処理中にエラーが発生しました。',
  no_code: '認証コードが見つかりませんでした。',
  unexpected: '予期せぬエラーが発生しました。後でもう一度お試しください。',
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithX, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URLからエラーコードを取得
  useEffect(() => {
    const errorCode = searchParams?.get('error');
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      setError(ERROR_MESSAGES[errorCode]);
    }
  }, [searchParams]);

  const handleXLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signInWithX();

      if (signInError) {
        throw signInError;
      }

      // 認証成功時にはリダイレクトが発生するため、
      // このコードは実行されません
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('X認証に失敗しました。後でもう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 min-h-content">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">チャット日記（仮）にログイン</h1>
            <p className="mt-2 text-sm text-gray-600">
              ログインするとチャット日記（仮）の作成、探すが可能になります。
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center justify-center mt-8">
            <Button
              onClick={handleXLogin}
              disabled={isLoading}
              className="w-full bg-black hover:bg-black/90 text-white flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-label="X logo"
                role="img"
              >
                <title>X (Twitter)</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {isLoading ? 'ログイン中...' : 'Xでログイン'}
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              X（旧Twitter）アカウントでログインします
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
