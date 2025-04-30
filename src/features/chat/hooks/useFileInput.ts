import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSupabase } from '@/hooks/useSupabase';
import { useRef, useState } from 'react';

// 画像アップロード制限
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// ファイルサイズを人間が読みやすい形式に変換（KB/MB表示）
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const useFileInput = () => {
  const { currentUser } = useCurrentUser();
  const { api } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleCameraClick = () => {
    setUploadError(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // 画像選択ハンドラー
  const handleImageClick = () => {
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // 画像形式チェック
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(
        `対応していないファイル形式です (${file.type}). JPEG, PNG, GIF, WEBPのみ使用できます。`,
      );
      e.target.value = '';
      return;
    }

    // ファイルサイズチェック
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError(
        `ファイルサイズが大きすぎます (${formatFileSize(
          file.size,
        )}). ${formatFileSize(MAX_IMAGE_SIZE)}以下の画像を選択してください。`,
      );
      e.target.value = '';
      return;
    }

    // 画像プレビューを表示
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedImage(file);

    // ファイル選択をクリア（同じファイルを再選択できるようにする）
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setUploadError(null);
  };

  const handleUpload = async (file: File) => {
    if (!currentUser?.id || !file) return null;

    try {
      setIsUploading(true);
      setUploadError(null);
      const uploadResult = await api.chatRoomMessage.uploadChatImage({
        file,
        userId: currentUser?.id,
      });

      handleCancelImage();
      return uploadResult.path || undefined;
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      setUploadError(
        '画像のアップロードに失敗しました。もう一度お試しください。',
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadError,
    fileInputRef,
    cameraInputRef,
    textareaRef,
    selectedImage,
    imagePreviewUrl,
    handleCameraClick,
    handleImageClick,
    handleImageChange,
    handleCancelImage,
    handleUpload,
  };
};
