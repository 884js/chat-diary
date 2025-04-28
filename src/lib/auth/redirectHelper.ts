'use client';

/**
 * ログイン後のリダイレクト先URLをサーバーに保存する
 * Server Actionを呼び出すラッパー関数
 */
export async function saveCurrentUrlForRedirect() {
  // 動的にserver actionをインポート（クライアント側のコードサイズを削減するため）
  const { saveRedirectUrl } = await import('@/actions/redirectUrlActions');

  try {
    // 現在のURLをserver actionを使ってcookieに保存
    await saveRedirectUrl(window.location.href);
    return { success: true };
  } catch (error) {
    console.error('リダイレクト先URLの保存に失敗しました', error);
    return { success: false, error };
  }
}
