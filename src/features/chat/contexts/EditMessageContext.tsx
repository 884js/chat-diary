'use client';

import { useSupabase } from '@/hooks/useSupabase';
import { createContext, useContext, useState } from 'react';

const EditMessageContext = createContext<{
  isEditMode: boolean;
  editMessageId: string | null;
  editMessage: string | null;
  handleEditMessage: (messageId: string, message: string) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: ({ message }: { message: string }) => Promise<void>;
} | null>(null);

export const EditMessageProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const { api } = useSupabase();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMessageId, setEditMessageId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  const handleEditMessage = (messageId: string, message: string) => {
    setIsEditMode(true);
    setEditMessageId(messageId);
    setEditMessage(message);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditMessageId(null);
    setEditMessage(null);
  };

  const handleSaveEdit = async ({ message }: { message: string }) => {
    if (!editMessageId) return;

    await api.chatRoomMessage.editMessage({
      messageId: editMessageId,
      content: message,
    });
  };

  return (
    <EditMessageContext.Provider
      value={{
        isEditMode,
        editMessageId,
        editMessage,
        handleEditMessage,
        handleCancelEdit,
        handleSaveEdit,
      }}
    >
      {children}
    </EditMessageContext.Provider>
  );
};

export const useEditMessage = () => {
  const context = useContext(EditMessageContext);
  if (!context) {
    throw new Error(
      'useEditMessage must be used within an EditMessageProvider',
    );
  }
  return context;
};
