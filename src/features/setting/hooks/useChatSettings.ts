import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SupabaseApi } from '@/lib/supabase/api';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { ChatSetting } from '../types';

export function useChatSettings() {
  const supabase = createClient();
  const api = new SupabaseApi(supabase);
  const { currentUser } = useCurrentUser();

  // チャット設定
  const [settings, setSettings] = useState<ChatSetting | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['chat-settings'],
    queryFn: () => api.user.getChatSettings(currentUser?.id || ''),
    enabled: !!currentUser?.id,
  });

  // 設定を保存
  const saveSettings = async (data: Partial<ChatSetting>) => {
    if (!settings) return false;

    const updatedSettings = {
      ...settings,
      ...data,
    };

    setIsSaving(true);
    try {
      await api.user.updateChatSettings(
        updatedSettings.user_id,
        updatedSettings,
      );
      refetch();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return true;
    } catch (error) {
      console.error('チャット設定の保存に失敗しました', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // 設定値を更新
  const updateSettings = (newSettings: Partial<ChatSetting>) => {
    if (!settings) return;

    setSettings((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...newSettings,
      };
    });
  };

  useEffect(() => {
    if (!data) return;

    setSettings({
      user_id: data.user_id,
    });
  }, [data]);

  return {
    settings,
    isSaving,
    saveSuccess,
    updateSettings,
    saveSettings,
  };
}
