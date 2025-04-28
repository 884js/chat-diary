import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useKeyboard } from '@/contexts/KeyboardContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { FiAlertCircle, FiImage, FiSend, FiX } from 'react-icons/fi';

// 画像アップロード制限
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// ファイルサイズを人間が読みやすい形式に変換（KB/MB表示）
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface ChatInputProps {
  chatRoomId: string;
  onSend: ({
    imagePath,
    message,
  }: {
    imagePath: string | undefined;
    message: string;
  }) => void;
  isDisabled: boolean;
  onImageSelect?: (file: File) => Promise<string | undefined>;
  onHeightChange?: (height: number) => void; // ★追加
}

export function ChatInput({
  chatRoomId,
  onSend,
  isDisabled,
  onImageSelect,
  onHeightChange,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isKeyboardVisible } = useKeyboard();

  const isButtonDisabled =
    (!message.trim() && !selectedImage) || isDisabled || isUploading;

  // 画像選択ハンドラー
  const handleImageClick = () => {
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 画像選択時の処理
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
  };

  // 画像選択をキャンセルする
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setUploadError(null);
  };

  // メッセージ送信処理
  const handleSend = async () => {
    if (isButtonDisabled) return;

    let imagePath: string | undefined;
    let hasError = false;

    if (selectedImage && onImageSelect) {
      try {
        setIsUploading(true);
        setUploadError(null);
        const uploadResult = await onImageSelect(selectedImage);
        imagePath = uploadResult;

        // 画像選択をクリア
        handleCancelImage();
      } catch (error) {
        console.error('画像アップロードエラー:', error);
        setUploadError(
          '画像のアップロードに失敗しました。もう一度お試しください。',
        );
        hasError = true;
      } finally {
        setIsUploading(false);
      }
    }

    if (hasError) {
      setMessage(message);
    }

    setMessage('');

    await onSend({ imagePath, message });
  };

  // キーボードイベントの処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enterで送信、通常のEnterは改行
    if (e.key === 'Enter' && e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  // Textareaの高さを自動調整する関数
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);

    // 高さをリセットして、スクロールの高さに基づいて再設定
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const placeholder = useMemo(() => {
    if (isDisabled) {
      return 'チャット送信はできません';
    }

    if (isUploading) {
      return '画像をアップロード中...';
    }

    return 'メッセージを入力...';
  }, [isDisabled, isUploading]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (textareaRef.current && onHeightChange) {
      const textareaHeight = textareaRef.current.scrollHeight;
      const additionalHeight = textareaHeight > 150 ? 150 : textareaHeight;
      const bottomPadding = isKeyboardVisible ? 0 : 64;
      let height = 78 + bottomPadding + additionalHeight; // Textareaと送信ボタンなどのベース高さ

      if (selectedImage) {
        height += 150; // 画像プレビューぶん
      }

      if (uploadError) {
        height += 40; // エラー文ぶん（おおよその高さ）
      }
      onHeightChange(height);
    }
  }, [message, imagePreviewUrl, uploadError, isKeyboardVisible]);

  return (
    <div
      className={`bg-white border-t border-slate-200 p-3 w-full z-[60] transition-all duration-300 ${
        isKeyboardVisible ? 'bottom-0 overflow-y-auto' : 'bottom-[64px]'
      }`}
    >
      {/* エラーメッセージ */}
      {uploadError && (
        <div className="max-w-4xl mx-auto mb-2">
          <div className="p-2 bg-red-50 text-red-600 rounded-md text-xs flex items-start">
            <FiAlertCircle className="mr-1 mt-0.5 flex-shrink-0" size={14} />
            <span>{uploadError}</span>
          </div>
        </div>
      )}

      {/* 画像プレビュー */}
      {imagePreviewUrl && (
        <div className="max-w-4xl mx-auto mb-2 relative">
          <div className="relative h-32 overflow-hidden rounded-md border border-slate-300 w-fit">
            <img
              src={imagePreviewUrl}
              alt="プレビュー"
              className="h-full w-auto object-contain"
            />
            <button
              type="button"
              onClick={handleCancelImage}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              aria-label="画像選択をキャンセル"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        {/* 画像選択ボタン */}
        {onImageSelect && !isDisabled && (
          <button
            type="button"
            onClick={handleImageClick}
            disabled={isUploading}
            className={`rounded-full w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="画像を選択"
            title={`画像を選択 (最大 ${formatFileSize(MAX_IMAGE_SIZE)})`}
          >
            <FiImage size={20} className="text-slate-600" />
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          className="hidden"
          disabled={isUploading}
        />
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={adjustTextareaHeight}
          placeholder={placeholder}
          className="flex-1 rounded-lg py-2 px-4 border border-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-400 min-h-[40px] max-h-[150px] resize-none"
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isUploading}
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={isButtonDisabled}
          className={`rounded-full w-10 h-10 flex items-center justify-center p-0 shadow-md transition-all duration-200 ${
            isButtonDisabled
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105'
          }`}
          aria-label="メッセージを送信"
        >
          {isUploading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <FiSend className="text-white" size={20} />
          )}
        </Button>
      </div>
    </div>
  );
}
