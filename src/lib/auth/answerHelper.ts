'use client';

// 回答データを一時的に保存するcookieの名前
const TEMP_ANSWER_DATA = 'temp_answer_data';
const TEMP_CHATROOM_ID = 'temp_chatroom_id';

/**
 * 回答データを一時的にローカルストレージに保存する
 */
export function saveAnswerData(
  data: Record<string, string>,
  chatRoomId: string,
) {
  try {
    // データをJSON文字列に変換して保存
    localStorage.setItem(TEMP_ANSWER_DATA, JSON.stringify(data));
    localStorage.setItem(TEMP_CHATROOM_ID, chatRoomId);
    return { success: true };
  } catch (error) {
    console.error('回答データの保存に失敗しました', error);
    return { success: false, error };
  }
}

/**
 * 保存された回答データを取得する
 */
export function getAnswerData(): {
  data: Record<string, string> | null;
  chatRoomId: string | null;
} {
  try {
    const dataStr = localStorage.getItem(TEMP_ANSWER_DATA);
    const chatRoomId = localStorage.getItem(TEMP_CHATROOM_ID);

    if (!dataStr) return { data: null, chatRoomId };

    return {
      data: JSON.parse(dataStr) as Record<string, string>,
      chatRoomId,
    };
  } catch (error) {
    console.error('回答データの取得に失敗しました', error);
    return { data: null, chatRoomId: null };
  }
}

/**
 * 保存された回答データを削除する
 */
export function clearAnswerData() {
  try {
    localStorage.removeItem(TEMP_ANSWER_DATA);
    localStorage.removeItem(TEMP_CHATROOM_ID);
    return { success: true };
  } catch (error) {
    console.error('回答データの削除に失敗しました', error);
    return { success: false, error };
  }
}

/**
 * ログイン後のリダイレクト先URLをローカルストレージに保存する
 * @param url リダイレクト先のURL（現在のページのURL）
 */
export function saveLoginRedirectUrl(url: string) {
  try {
    localStorage.setItem('login_redirect_url', url);
    return { success: true };
  } catch (error) {
    console.error('リダイレクト先URLの保存に失敗しました', error);
    return { success: false, error };
  }
}

/**
 * 保存されたリダイレクト先URLを取得する
 */
export function getLoginRedirectUrl(): string | null {
  return localStorage.getItem('login_redirect_url');
}

/**
 * 保存されたリダイレクト先URLを削除する
 */
export function clearLoginRedirectUrl() {
  localStorage.removeItem('login_redirect_url');
}
