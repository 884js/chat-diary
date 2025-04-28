import { useSupabase } from '@/hooks/useSupabase';
import { useEffect, useRef } from 'react';

type Props = {
  userId: string;
  onFetch: () => void;
};

export const useSubscribeUserChatRoomList = ({ userId, onFetch }: Props) => {
  const { api } = useSupabase();
  const isSubscribed = useRef(false);

  useEffect(() => {
    if (!userId) return;

    // すでにサブスクライブしている場合は重複を避ける
    if (isSubscribed.current) return;

    const messageChannel = api.chat.subscribeToUserChatRoomList({
      userId: userId,
      onStatusChange: onFetch,
    });

    isSubscribed.current = true;

    // クリーンアップ関数
    return () => {
      isSubscribed.current = false;
      messageChannel.unsubscribe();
    };
  }, [userId, onFetch, api.chat]);
};
