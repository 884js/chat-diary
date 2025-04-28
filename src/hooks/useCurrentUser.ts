import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  const { api } = useSupabase();
  const { user, isLoading } = useAuth();
  const { data: userProfile } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => api.user.getUserProfile({ userId: user?.id || '' }),
    enabled: !!user?.id,
  });

  // デフォルトチャットルームの情報を取得
  const { data: defaultChatRoom } = useQuery({
    queryKey: ['defaultChatRoom', user?.id],
    queryFn: () => api.chatRoom.getDefaultChatRoom(user?.id || ''),
    enabled: !!user?.id,
  });

  // チャットリンクを生成（デフォルトチャットルームのIDを使用）
  const chatStartUrl = defaultChatRoom?.id
    ? `${window.location.origin}/chat/${defaultChatRoom.id}`
    : user?.id
      ? `${window.location.origin}/users/${user.id}/`
      : '';

  return {
    currentUser: user,
    currentUserProfile: userProfile,
    defaultChatRoom,
    isLoading,
    chatStartUrl,
    isLoggedIn: !!user,
  };
};
