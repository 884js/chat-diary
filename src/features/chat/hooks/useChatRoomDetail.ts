import { useSupabase } from '@/hooks/useSupabase';
import { useQuery } from '@tanstack/react-query';

export const useChatRoomDetail = ({ id }: { id: string }) => {
  const { api } = useSupabase();

  const {
    data: chatRoom,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['chatRoomDetail', id],
    queryFn: async () => {
      return api.chat.getChatRoomById({ id });
    },
    enabled: !!id,
  });

  return { chatRoom, isLoading, refetch };
};
