import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './databaseTypes';
// 環境変数がない場合のフォールバック値
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの初期化（ブラウザ環境用）
export const createClient = ({
  token,
}: {
  token?: string;
} = {}) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      ...(token && {
        headers: {
          chatToken: token,
        },
      }),
    },
    // リアルタイム機能の設定
    realtime: {
      params: {
        ...(token && {
          headers: {
            chatToken: token,
          },
        }),
      },
    },
  });
};
