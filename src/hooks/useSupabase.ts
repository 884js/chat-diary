import { SupabaseApi } from '@/lib/supabase/api';
import { createClient } from '@/lib/supabase/client';

export const useSupabase = () => {
  const supabase = createClient();
  const api = new SupabaseApi(supabase);
  return { api, supabase };
};
