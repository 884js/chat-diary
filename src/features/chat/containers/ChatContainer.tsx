'use client';

import { ChatHeader, ChatInput } from '@/features/chat/components';
import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { useChatRoomDetail } from "@/features/chat/hooks/useChatRoomDetail";
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SupabaseApi } from '@/lib/supabase/api';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

type ChatContainerProps = {
  id: string;
};

export const ChatContainer = ({ id }: ChatContainerProps) => {
  const { currentUser } = useCurrentUser();
  const [inputHeight, setInputHeight] = useState(192); // 初期高さは仮

  const availableHeight = `calc(100dvh - ${inputHeight}px)`;

  const { chatRoom, isLoading, refetch } = useChatRoomDetail({
    id,
  });
  const isOwner = currentUser ? currentUser.id === chatRoom?.user_id : false;

  const supabase = createClient({ token: id });
  const api = new SupabaseApi(supabase);

  const isSendMessageDisabled = isLoading;

  // 画像を選択してアップロードする処理
  const handleImageSelect = async (file: File) => {
    if (!chatRoom?.id) return;

    // 画像をアップロード
    const uploadResult = await api.chat.uploadChatImage({
      file,
      chatRoomId: chatRoom.id,
    });

    return uploadResult.path || undefined;
  };

  // メッセージ送信処理
  const handleSendMessage = async ({
    imagePath,
    message,
  }: { imagePath: string | undefined; message: string }) => {
    if (!chatRoom?.id || !currentUser?.id) return;

    const trimmedMessage = message.trim();

    const senderType = isOwner ? 'user' : 'ai';

    try {
      await api.chat.sendMessage({
        content: trimmedMessage,
        sender: senderType,
        imagePath: imagePath,
        senderId: currentUser.id,
      });
      refetch();
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    }
  };

  if (!chatRoom) return null;

  return (
    <div className="overflow-hidden">
      {/* ヘッダー */}
      <ChatHeader />

      {/* メッセージ一覧 */}
      <div
        className="flex-1 p-2 md:min-w-5xl md:mx-auto"
        style={{ height: availableHeight }}
      >
        <ChatMessages
          chatRoom={chatRoom}
          isLoading={isLoading}
          messages={chatRoom?.chat_room_messages || []}
          isOwner={isOwner}
          isChatEnded={false}
          containerHeight={availableHeight}
        />
      </div>
      {/* 入力部分 */}
      <ChatInput
        chatRoomId={chatRoom.id}
        onSend={handleSendMessage}
        isDisabled={isSendMessageDisabled}
        onImageSelect={handleImageSelect}
        onHeightChange={setInputHeight}
      />
    </div>
  );
};
