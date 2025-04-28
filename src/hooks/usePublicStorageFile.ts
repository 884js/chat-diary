import type { BucketKeys } from '@/constants';
import { useSupabase } from '@/hooks/useSupabase';
import { useEffect, useState } from 'react';

type Props = {
  imagePath: string | null;
  storageName: keyof typeof BucketKeys;
};

export const usePublicStorageFile = ({ imagePath, storageName }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    if (!imagePath) return;
    const { data } = supabase.storage.from(storageName).getPublicUrl(imagePath);
    setImageUrl(data?.publicUrl || null);
  }, [imagePath, storageName, supabase]);

  return { imageUrl };
};
