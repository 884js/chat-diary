import { useSupabase } from '@/hooks/useSupabase';
import { useQuery } from '@tanstack/react-query';
import { validate as uuidValidate } from 'uuid';

export const useChatRoomByToken = ({ token }: { token: string }) => {
  const { api } = useSupabase();

  // トークンがUUIDかどうかを判断
  const isUUID = uuidValidate(token);

  const {
    data: chatRoom,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['chatRoom', token],
    queryFn: async () => {
      // UUIDの場合はIDとして、それ以外の場合はトークンとして扱う
      if (isUUID) {
        return api.chat.getChatRoomById({ id: token });
      }
    },
    enabled: !!token,
  });

  return { chatRoom, isLoading, refetch };
};
