import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  FiCornerUpRight,
  FiEdit,
  FiMoreVertical,
  FiTrash,
} from 'react-icons/fi';
import { useStorageImage } from '../../../hooks/useStorageImage';
import { useMessageAction } from '../contexts/MessageActionContext';
import { ChatImage } from './ChatImage';
import type { ChatRoomMessage } from '@/lib/supabase/api/ChatRoomMessage';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  replyTo: ChatRoomMessage | null;
  owner: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  isFromReceiver: boolean;
  timestamp: string;
  imagePath?: string | null;
  isOwner: boolean;
  onScrollToBottom: () => void;
}

export function ChatMessage({
  id,
  content,
  timestamp,
  imagePath = null,
  owner,
  replyTo,
}: MessageProps) {
  const {
    handleEditMessage,
    messageId,
    handleDeleteMessage,
    handleReplyMessage,
  } = useMessageAction();

  const { imageUrl: storageImageUrl } = useStorageImage({
    imagePath,
    storageName: 'chats',
  });

  const getImageUrl = owner.avatar_url;
  const displayName = owner.display_name;

  // メニュー表示状態を管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // メニュー外のクリックを検知してメニューを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // メニュー表示切り替え
  const toggleMenu = (e: React.MouseEvent) => {
    // イベント伝播を停止してスクロールに干渉しないようにする
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = async () => {
    await handleDeleteMessage({ messageId: id });
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    handleEditMessage({ messageId: id, message: content });
    setIsMenuOpen(false);
  };

  const handleReply = () => {
    handleReplyMessage({ parentMessageId: id, message: content });
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`flex mb-4 group relative transition-all duration-150 rounded-sm px-2 py-1 w-full text-left ${
        messageId === id ? 'bg-gray-100' : ''
      }`}
      id={id}
      aria-label="メッセージ"
    >
      {/* プロフィール画像 */}
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
      <div className="flex-1 min-w-0 relative">
        {/* メッセージ内容とメニューボタンを横に並べる */}
        <div className="flex items-start">
          {/* メッセージ内容部分 */}
          <div className="flex-1 text-[#222]">
            {replyTo && (
              <a href={`#${replyTo.id}`}>
                <div className="text-xs text-gray-500 mb-2">
                  {replyTo.content}
                </div>
                <hr className="my-2 border-gray-200" />
              </a>
            )}
            {content && (
              <div className="relative overflow-hidden">
                <MarkdownRenderer content={content} />
              </div>
            )}

            {/* 画像があれば表示する */}
            {storageImageUrl && (
              <div className="mt-2">
                <ChatImage imageUrl={storageImageUrl} />
              </div>
            )}

            {/* タイムスタンプを右下に配置 */}
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{timestamp}</span>
            </div>
          </div>

          {/* 三点リーダーメニューボタン - メッセージの横に配置 */}
          <button
            type="button"
            onClick={toggleMenu}
            className="p-1.5 ml-2 rounded-full hover:bg-gray-100 text-gray-600 z-10 shrink-0"
            aria-label="メッセージメニューを開く"
          >
            <FiMoreVertical size={16} />
          </button>
        </div>

        {/* コンテキストメニュー */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-0 z-20 bg-white shadow-lg rounded-md py-1 min-w-[120px] border border-gray-200"
            role="menu"
            tabIndex={-1}
          >
            <button
              type="button"
              onClick={handleEdit}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <FiEdit className="mr-2" size={14} />
              <span>編集</span>
            </button>
            <button
              type="button"
              onClick={handleReply}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <FiCornerUpRight className="mr-2" size={14} />
              <span>返信</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <FiTrash className="mr-2" size={14} />
              <span>削除</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
