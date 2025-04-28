import { ChatContainer } from '@/features/chat/containers/ChatContainer';
import { SupabaseApi } from '@/lib/supabase/api';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const api = new SupabaseApi(supabase);

  // 現在のユーザーを取得
  const currentUser = await api.user.getCurrentUser();

  // ログインしていない場合はログインページにリダイレクト
  if (!currentUser) {
    redirect('/login');
  }

  // ユーザーのデフォルトチャットルームを取得
  const defaultChatRoom = await api.chatRoom.getDefaultChatRoom(currentUser.id);

  // デフォルトチャットルームがない場合（念のため）
  if (!defaultChatRoom) {
    // デフォルトのチャットルームを作成する
    const newChatRoom = await supabase
      .from('rooms')
      .insert({
        user_id: currentUser.id,
      })
      .select()
      .single();

    if (newChatRoom.error) {
      // エラー処理
      console.error('Failed to create default chat room', newChatRoom.error);
      return (
        <div className="flex items-center justify-center min-h-dvh">
          <p>エラーが発生しました。再度ログインしてお試しください。</p>
        </div>
      );
    }

    return <ChatContainer token={newChatRoom.data.id} />;
  }

  return <ChatContainer token={defaultChatRoom.id} />;
}
