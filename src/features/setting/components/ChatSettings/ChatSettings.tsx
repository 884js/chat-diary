'use client';

import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useChatSettings } from '../../hooks';
import type { ChatSetting } from '../../types';
import { SectionHeader } from '../SectionHeader';

export const ChatSettings = () => {
  const { currentUser } = useCurrentUser();
  const { settings, updateSettings, saveSettings } = useChatSettings();
  const { showSnackbar } = useSnackbar();

  // 設定保存時の共通処理
  const handleSaveSettings = async (settingsData: Partial<ChatSetting>) => {
    try {
      const result = await saveSettings(settingsData);
      return result;
    } catch (error) {
      showSnackbar({
        message: '設定の保存に失敗しました',
        type: 'error',
      });
      return false;
    }
  };

  if (!settings)
    return (
      <Card>
        <SectionHeader
          title="チャット設定"
          description="チャットに関する設定を行います"
        />
        <Loader />
      </Card>
    );

  return (
    <Card>
      <SectionHeader
        title="チャット設定"
        description="チャットに関する設定を行います"
      />
    </Card>
  );
};
