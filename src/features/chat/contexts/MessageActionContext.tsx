'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentUserRoom } from '@/hooks/useCurrentUserRoom';
import { useSupabase } from '@/hooks/useSupabase';
import { createContext, useContext, useRef, useState } from 'react';

const MessageActionContext = createContext<{
  mode: 'edit' | 'reply' | null;
  messageId: string | null;
  selectedMessage: string | null;
  handleEditMessage: ({
    messageId,
    message,
  }: {
    messageId: string;
    message: string;
  }) => void;
  handleResetMode: () => void;
  handleSaveEdit: ({ message }: { message: string }) => Promise<void>;
  handleDeleteMessage: ({ messageId }: { messageId: string }) => Promise<void>;
  handleReplyMessage: ({
    parentMessageId,
    message,
  }: {
    parentMessageId: string;
    message: string;
  }) => Promise<void>;
  handleSendReplyMessage: ({ message }: { message: string }) => Promise<void>;
  replyMessageRef: React.RefObject<HTMLDivElement>;
} | null>(null);

export const MessageActionProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const { currentUser } = useCurrentUser();
  const { refetchRoom } = useCurrentUserRoom();
  const { api } = useSupabase();
  const [mode, setMode] = useState<'edit' | 'reply' | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const replyMessageRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleEditMessage = ({
    messageId,
    message,
  }: { messageId: string; message: string }) => {
    setMode('edit');
    setMessageId(messageId);
    setSelectedMessage(message);
  };

  const handleResetMode = () => {
    setMode(null);
    setMessageId(null);
    setSelectedMessage(null);
  };

  const handleSaveEdit = async ({ message }: { message: string }) => {
    if (!messageId) return;

    await api.chatRoomMessage.editMessage({
      messageId: messageId,
      content: message,
    });

    handleResetMode();
    await refetchRoom();
  };

  const handleDeleteMessage = async ({ messageId }: { messageId: string }) => {
    if (!messageId) return;

    await api.chatRoomMessage.deleteMessage({ messageId: messageId });
    await refetchRoom();
  };

  const handleReplyMessage = async ({
    parentMessageId,
    message,
  }: { parentMessageId: string; message: string }) => {
    if (!parentMessageId || !currentUser?.id) return;

    setMode('reply');
    setMessageId(parentMessageId);
    setSelectedMessage(message);
  };

  const handleSendReplyMessage = async ({ message }: { message: string }) => {
    if (!messageId || !currentUser?.id) return;

    await api.chatRoomMessage.replyMessage({
      parentMessageId: messageId,
      content: message,
      senderId: currentUser?.id,
    });

    handleResetMode();
    await refetchRoom();
  };

  return (
    <MessageActionContext.Provider
      value={{
        mode,
        messageId,
        selectedMessage,
        handleEditMessage,
        handleResetMode,
        handleSaveEdit,
        handleDeleteMessage,
        handleReplyMessage,
        handleSendReplyMessage,
        replyMessageRef,
      }}
    >
      {children}
    </MessageActionContext.Provider>
  );
};

export const useMessageAction = () => {
  const context = useContext(MessageActionContext);
  if (!context) {
    throw new Error(
      'useMessageAction must be used within an MessageActionProvider',
    );
  }
  return context;
};
