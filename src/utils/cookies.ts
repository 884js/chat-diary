/**
 * Cookie操作ユーティリティ
 */

// リダイレクト先情報を保存するためのcookie名
export const REDIRECT_URL_COOKIE = 'redirect_after_login';

/**
 * ログイン後のリダイレクト先をcookieに保存する
 * @param url リダイレクト先URL
 * @param expiresMinutes cookieの有効期限（分）
 */
export const saveRedirectUrl = (url: string, expiresMinutes = 30): void => {
  // cookieの有効期限を設定
  const expiresDate = new Date();
  expiresDate.setTime(expiresDate.getTime() + expiresMinutes * 60 * 1000);

  // cookieにURLを保存
  document.cookie = `${REDIRECT_URL_COOKIE}=${encodeURIComponent(url)};expires=${expiresDate.toUTCString()};path=/;SameSite=Lax`;
};

/**
 * ログイン後のリダイレクト先をcookieから取得する
 * @returns 保存されていたリダイレクト先URL、なければnull
 */
export const getRedirectUrl = (): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === REDIRECT_URL_COOKIE) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * リダイレクト用cookieを削除する
 */
export const clearRedirectUrl = (): void => {
  document.cookie = `${REDIRECT_URL_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};
