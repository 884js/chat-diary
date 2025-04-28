import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '../../../hooks/useSupabase';

type OgpPayload = {
  displayName: string;
  welcomeMessage: string;
  avatarUrl: string;
};

function truncateMessage(message: string, maxLength = 250): string {
  if (!message) return '';

  const sliced = [...message].slice(0, maxLength).join(''); // サロゲートペア安全
  return sliced + (message.length > maxLength ? '…' : '');
}

export const useSaveProfileMessageOgp = () => {
  const { supabase } = useSupabase();

  const { mutateAsync, isPending, data } = useMutation<
    { path: string } | null,
    Error,
    OgpPayload
  >({
    mutationFn: async (payload: OgpPayload) => {
      const { data, error } = await supabase.functions.invoke<{ path: string }>(
        'generateProfileMessageOgp',
        {
          body: {
            displayName: payload.displayName,
            welcomeMessage: truncateMessage(payload.welcomeMessage),
            avatarUrl: payload.avatarUrl,
          },
        },
      );
      return data;
    },
  });

  return { mutateAsync, isPending, data };
};
