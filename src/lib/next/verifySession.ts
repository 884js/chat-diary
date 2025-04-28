import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Props = {
  redirectTo?: string;
};

export const verifySession = async ({ redirectTo = '/login' }: Props = {}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return redirect(redirectTo);
  }
};
