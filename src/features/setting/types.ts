// 設定画面で使用する型定義
export type SettingSection = {
  title: string;
  description: string;
};

export type NotificationSetting = {
  enabled: boolean;
  email: boolean;
  browser: boolean;
  mobile: boolean;
};

// 質問項目の型定義
export type QuestionItem = {
  id: string;
  question_label: string;
  input_type: 'text' | 'select';
  is_required: boolean;
  options: string[];
  display_order: number;
};

export type ChatSetting = {
  user_id: string;
};
