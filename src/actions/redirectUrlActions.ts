'use server';

import { cookies } from 'next/headers';
import { REDIRECT_URL_COOKIE } from './constants';

/**
 * ログイン後のリダイレクト先をcookieに保存する
 * @param url リダイレクト先URL
 */
export async function saveRedirectUrl(url: string) {
  const cookieStore = cookies();

  // セキュアなcookieとして保存（HTTPSでのみ送信、JavaScript経由でのアクセス不可）
  cookieStore.set({
    name: REDIRECT_URL_COOKIE,
    value: url,
    httpOnly: true, // JavaScriptからアクセス不可
    path: '/',
    secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPSのみ
    sameSite: 'lax',
    maxAge: 60 * 30, // 30分
  });

  return { success: true };
}

/**
 * リダイレクト用cookieを削除する
 */
export async function clearRedirectUrl() {
  const cookieStore = cookies();
  cookieStore.delete(REDIRECT_URL_COOKIE);
  return { success: true };
}

/**
 * ログイン後のリダイレクト先をcookieから取得する
 * @returns 保存されていたリダイレクト先URL、なければnull
 */
export async function getRedirectUrl() {
  const cookieStore = cookies();
  const redirectCookie = cookieStore.get(REDIRECT_URL_COOKIE);
  return redirectCookie?.value || null;
}
