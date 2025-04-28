import type { BucketKeys, FileBucketPath } from '@/constants';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSupabase } from './useSupabase';

type Props = {
  bucketName: keyof typeof BucketKeys;
  onSuccess?: (filePath: string) => void;
  onError?: (error: Error) => void;
};

export const useFileUpload = ({ bucketName, onSuccess, onError }: Props) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      file,
      path,
      fileName,
      contentType,
    }: {
      file: File | Blob;
      path: FileBucketPath;
      fileName: string;
      contentType?: string;
    }) => {
      const safeName = `${path}${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(safeName, file, {
          upsert: true,
          contentType: contentType || file.type,
        });

      if (error) throw error;

      return safeName;
    },
    onSuccess,
    onError,
  });

  useEffect(() => {
    if (error) {
      setUploadError(
        '画像のアップロードに失敗しました。もう一度お試しください。',
      );
    }
  }, [error]);

  const resetUploadError = () => {
    setUploadError(null);
  };

  return {
    data,
    error,
    isPending,
    mutateAsync,
    uploadError,
    resetUploadError,
    setUploadError,
  };
};
