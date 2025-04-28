import { useSupabase } from '@/hooks/useSupabase';
import { useQueries } from '@tanstack/react-query';

type Props = {
  userId: string;
};

export const useUserSettings = ({ userId }: Props) => {
  const { api } = useSupabase();
  const [
    {
      data: chatSettings,
      isLoading: chatSettingsLoading,
      error: chatSettingsError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ['chat_settings', userId],
        queryFn: async () => {
          return api.user.getChatSettings(userId);
        },
        enabled: !!userId,
      },
    ],
  });

  return {
    chatSettings,
    isLoading: chatSettingsLoading,
    error: chatSettingsError,
  };
};
