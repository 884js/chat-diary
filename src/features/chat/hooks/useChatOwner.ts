import { useSupabase } from '@/hooks/useSupabase';
import { useQuery } from '@tanstack/react-query';
type Props = {
  receiverId: string | undefined;
};

export const useChatOwner = ({ receiverId }: Props) => {
  const { api } = useSupabase();

  // チャットルームのオーナーの情報を取得
  const { data: owner } = useQuery({
    queryKey: ['chatOwner', receiverId],
    queryFn: async () => {
      if (!receiverId) return null;
      return api.user.getUserProfile({ userId: receiverId });
    },
    enabled: !!receiverId,
  });

  return { owner };
};
