import { useSupabase } from '@/hooks/useSupabase';
import { useEffect } from 'react';

type Props = {
  userId: string | undefined;
  onRefresh: () => void;
};

export const useSubscribeChatRoom = ({ userId, onRefresh }: Props) => {
  const { api } = useSupabase();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!userId) return;

    // メッセージのリアルタイム更新をサブスクライブ
    const messageChannel = api.chat.subscribeToMessages({
      userId: userId,
      onMessage: (newMessage) => {
        onRefresh();
      },
    });

    // クリーンアップ関数
    return () => {
      messageChannel.unsubscribe();
    };
  }, [userId]);
};
