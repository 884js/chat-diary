import Image from 'next/image';
import { useStorageImage } from '../../../hooks/useStorageImage';
import { ChatImage } from './ChatImage';
export interface MessageProps {
  content: string;
  sender: 'user' | 'ai';
  owner: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  isFromReceiver: boolean;
  timestamp: string;
  showAvatar?: boolean;
  imagePath?: string | null;
  isOwner: boolean;
  onScrollToBottom: () => void;
}

export function ChatMessage({
  content,
  timestamp,
  showAvatar = true,
  imagePath = null,
  sender,
  owner,
  isOwner,
  onScrollToBottom,
}: MessageProps) {
  const { imageUrl: storageImageUrl } = useStorageImage({
    imagePath,
    storageName: 'chats',
    onSuccess: () => {
      onScrollToBottom();
    },
  });

  const getImageUrl = owner.avatar_url;

  const displayName = owner.display_name;

  return (
    <div className="flex mb-4">
      {/* プロフィール画像（全てのメッセージで表示） */}
      <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden mr-3">
        {getImageUrl ? (
          <Image
            src={getImageUrl}
            alt={displayName}
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm font-medium">
            {displayName.charAt(0)}
          </div>
        )}
      </div>

      {/* メッセージコンテンツ */}
      <div className="flex-1 min-w-0">
        {/* 時間のみ表示 */}
        <div className="mb-1 flex">
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>

        {/* 背景なしでテキスト色を統一 */}
        <div className="py-1 max-w-[85%] text-[#222]">
          {content && (
            <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
          )}

          {/* 画像があれば表示する */}
          {storageImageUrl && (
            <div className="mt-2">
              <ChatImage imageUrl={storageImageUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
