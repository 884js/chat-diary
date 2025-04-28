'use client';

import { Loader } from '@/components/ui/Loader';
import { ChatHeader, ChatInput } from '@/features/chat/components';
import { ChatMessages } from '@/features/chat/components/ChatMessages';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentUserRoom } from '@/hooks/useCurrentUserRoom';
import { useSupabase } from '@/hooks/useSupabase';
import { useEffect, useMemo, useState } from 'react';

export const ChatContainer = () => {
  const { api } = useSupabase();
  const { chatRoom, isLoadingRoom, refetchRoom } = useCurrentUserRoom();
  const { currentUser } = useCurrentUser();
  const [inputHeight, setInputHeight] = useState(192); // 初期高さは仮
  const [viewportHeight, setViewportHeight] = useState(0);
  const availableHeight = useMemo(
    () => `calc(${viewportHeight}px - ${inputHeight}px)`,
    [viewportHeight, inputHeight],
  );

  const isOwner = currentUser ? currentUser.id === chatRoom?.user_id : false;

  const isSendMessageDisabled = isLoadingRoom;

  // 画像を選択してアップロードする処理
  const handleImageSelect = async (file: File) => {
    if (!chatRoom?.id || !currentUser) return;

    // 画像をアップロード
    const uploadResult = await api.chatRoom.uploadChatImage({
      file,
      userId: currentUser?.id,
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
      await api.chatRoom.sendMessage({
        content: trimmedMessage,
        sender: senderType,
        imagePath: imagePath,
        senderId: currentUser.id,
      });
      refetchRoom();
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    }
  };

  useEffect(() => {
    const func = () => {
      const vv = window.visualViewport;
      setViewportHeight(vv?.height ?? 0);
    };

    window.addEventListener('resize', func);
    window.addEventListener('orientationchange', func);
    func();

    return () => {
      window.removeEventListener('resize', func);
      window.removeEventListener('orientationchange', func);
    };
  }, []);

  if (!chatRoom) return <Loader />;

  if (viewportHeight === 0) return <Loader />;

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
          isLoading={isLoadingRoom}
          messages={chatRoom?.chat_room_messages || []}
          isOwner={isOwner}
          isChatEnded={false}
        />
      </div>
      {/* 入力部分 */}
      <ChatInput
        onSend={handleSendMessage}
        isDisabled={isSendMessageDisabled}
        onImageSelect={handleImageSelect}
        onHeightChange={setInputHeight}
      />
    </div>
  );
};
