import { formatDate, isSameDay, parseISO } from '@/lib/date-fns';
import type { ChatRoomMessage } from '@/lib/supabase/api/ChatRoomMessage';
import type { ChatRoom } from '@/lib/supabase/api/ChatRoom';
import { useEffect, useMemo } from 'react';
import { useAutoScrollBottom } from '../hooks/useAutoScrollBottom';
import { ChatMessage } from './ChatMessage';

type Props = {
  chatRoom: ChatRoom;
  isLoading: boolean;
  messages: ChatRoomMessage[];
  isChatEnded: boolean;
  isOwner: boolean;
};

// 日付区切り線コンポーネント
const DateDivider = ({ date }: { date: string }) => (
  <div className="flex items-center my-4">
    <div className="flex-grow h-px bg-gray-200" />
    <div className="mx-4 text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full border border-gray-200">
      {date}
    </div>
    <div className="flex-grow h-px bg-gray-200" />
  </div>
);

export const ChatMessages = ({
  chatRoom,
  isLoading,
  messages,
  isOwner,
}: Props) => {
  const { messagesEndRef, handleScrollToBottom } = useAutoScrollBottom();

  // メッセージを日付とインデックスでグループ化
  const messagesWithDividers = useMemo(() => {
    const result: Array<{
      message: ChatRoomMessage;
      showDateDivider: boolean;
      date: Date | null;
    }> = [];

    let previousDate: Date | null = null;
    // 各メッセージを処理
    messages.forEach((msg, index) => {
      const messageDate = msg.created_at ? parseISO(msg.created_at) : null;
      let showDateDivider = false;

      if (messageDate) {
        // 日付が変わる場合（最初のメッセージか、前のメッセージと日付が異なる場合）
        if (!previousDate || !isSameDay(previousDate, messageDate)) {
          // すべての日付変更で区切り線を表示（今日を含む）
          showDateDivider = true;
          // 日付を更新
          previousDate = messageDate;
        }
      }

      result.push({
        message: msg,
        showDateDivider,
        date: messageDate,
      });
    });

    return result;
  }, [messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleScrollToBottom();
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        まだメッセージはありません。
      </div>
    );
  }

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full touch-pan-y">
      {/* チャットメッセージ */}
      {messagesWithDividers.map((item, index) => {
        const { message: msg, showDateDivider, date: messageDate } = item;

        // 表示処理を単純化: isOwnerとmsg.senderに基づいてisFromReceiverを判定
        let isFromReceiver: boolean;

        if (isOwner) {
          // オーナー視点: senderがreceiverかsystemなら自分から送信（反転した形で処理）
          isFromReceiver = msg.sender !== 'user' && msg.sender !== 'ai';
        } else {
          // 送信者視点: senderがreceiverかsystemなら相手から送信（そのまま処理）
          isFromReceiver = msg.sender === 'user' || msg.sender === 'ai';
        }

        return (
          <div key={msg.id}>
            {/* 日付区切り線 */}
            {showDateDivider && messageDate && (
              <DateDivider
                date={formatDate(messageDate, 'yyyy年M月d日(eee)')}
              />
            )}

            {/* メッセージ */}
            <ChatMessage
              id={msg.id}
              content={msg.content}
              owner={chatRoom.owner}
              sender={msg.sender}
              isFromReceiver={isFromReceiver}
              isOwner={isOwner}
              timestamp={formatDate(msg.created_at || '', 'HH:mm')}
              imagePath={msg.image_path}
              onScrollToBottom={handleScrollToBottom}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
