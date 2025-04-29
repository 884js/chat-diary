import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

export const useEditMessage = () => {
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

  return {
    isEditMode,
    editMessageId,
    editMessage,
    handleEditMessage,
    handleCancelEdit,
    handleSaveEdit,
  };
};
