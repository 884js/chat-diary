import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../databaseTypes';
import { CalendarApi } from './calendar';
export interface ChatRoomMessage {
  id: string;
  owner_id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
  image_path: string;
}

export type ChatRoom = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  owner: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
};

export type RoomMessage = {
  id: string;
  owner_id: string;
  sender: 'user' | 'ai';
  content: string;
  image_path: string | null;
  reply_to_message_id: string | null;
  created_at: string;
  updated_at: string;
};

export class ChatApi {
  private calendarApi: CalendarApi;
  constructor(private supabase: SupabaseClient<Database>) {
    this.calendarApi = new CalendarApi(supabase);
  }

  async createChatRoom({ userId }: { userId: string }) {
    try {
      const { data: chatRoomData, error: chatRoomError } = await this.supabase
        .from('rooms')
        .insert({
          user_id: userId,
        })
        .select()
        .single();

      if (chatRoomError) {
        console.error('Chat room creation error:', chatRoomError);
        throw chatRoomError;
      }

      return chatRoomData;
    } catch (error) {
      console.error('Error in createChatRoom:', error);
      throw error;
    }
  }

  async getRoomMessagesByDateRange({
    userId,
    startAt,
    endAt,
  }: {
    userId: string;
    startAt: string;
    endAt: string;
  }) {
    const { data, error } = await this.supabase
      .rpc('get_room_messages_by_date_range', {
        params: {
          user_id: userId,
          start_at: startAt,
          end_at: endAt,
        },
      })
      .overrideTypes<Array<RoomMessage>, { merge: false }>();

    if (error) {
      console.error('Chat room fetch error:', error);
      throw error;
    }

    return data;
  }

  // IDでチャットルームのデータを取得
  async getChatRoomById({ id }: { id: string }) {
    const { data: chatRoom, error: roomError } = await this.supabase
      .from('rooms')
      .select('*, owner:users(*)')
      .eq('id', id)
      .maybeSingle()
      .overrideTypes<ChatRoom, { merge: false }>();

    if (roomError || !chatRoom) {
      console.error('Chat room fetch error:', roomError);
      throw roomError;
    }

    // メッセージを古い順に取得
    const { data: messages, error: messagesError } = await this.supabase
      .from('room_messages')
      .select('id, owner_id, content, sender, created_at, image_path')
      .eq('owner_id', chatRoom.user_id)
      .order('created_at', { ascending: true })
      .overrideTypes<Array<ChatRoomMessage>, { merge: false }>();

    if (messagesError) {
      console.error('Message fetch error:', messagesError);
      throw messagesError;
    }

    // 統合して返す
    return {
      ...chatRoom,
      chat_room_messages: messages ?? [],
    };
  }

  // チャットルームの全メッセージを取得（タイムスタンプで昇順ソート）
  async getMessages({ chatRoomId }: { chatRoomId: string }) {
    const { data, error } = await this.supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', chatRoomId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Messages fetch error:', error);
      throw error;
    }

    return data;
  }

  // トークン付きでメッセージを送信
  async sendMessage({
    content,
    sender,
    senderId,
    imagePath = null,
  }: {
    content: string;
    sender: 'user' | 'ai';
    senderId: string;
    imagePath?: string | null;
  }) {
    const { data, error } = await this.supabase
      .from('room_messages')
      .insert({
        content,
        sender,
        owner_id: senderId,
        image_path: imagePath,
      })
      .select('created_at')
      .single();

    if (error || !data || !data.created_at) {
      console.error('Message send error:', error);
      throw error;
    }

    // カレンダーの要約を更新
    await this.calendarApi.upsertCalendarDay(senderId, data.created_at);

    return data;
  }

  subscribeToUserChatRoomList({
    userId,
    onStatusChange,
  }: {
    userId: string;
    onStatusChange: (chatRoom: ChatRoom) => void;
  }): RealtimeChannel {
    const channel = this.supabase
      .channel(`chat_rooms_and_messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_room_messages',
        },
        async (payload) => {
          const newMessage = payload.new as ChatRoomMessage;

          const { data } = await this.supabase
            .from('rooms')
            .select('*')
            .eq('id', newMessage.owner_id)
            .or(`user_id.eq.${userId}`)
            .single();

          if (data) {
            onStatusChange(payload.new as ChatRoom);
          }
        },
      )
      .subscribe();

    return channel;
  }

  subscribeToMessages({
    userId,
    onMessage,
  }: {
    userId: string;
    onMessage: (message: ChatRoomMessage) => void;
  }): RealtimeChannel {
    // メッセージテーブルの変更をサブスクライブ
    const channel = this.supabase
      .channel(`chat_room_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `owner_id=eq.${userId}`,
        },
        (payload) => {
          onMessage(payload.new as ChatRoomMessage);
        },
      )
      .subscribe();

    return channel;
  }

  // チャットルームのステータス変更をサブスクライブ
  subscribeToChatRoomStatus({
    chatRoomId,
    onStatusChange,
  }: {
    chatRoomId: string;
    onStatusChange: (chatRoom: ChatRoom) => void;
  }): RealtimeChannel {
    // チャットルームのステータス変更をサブスクライブ
    const channel = this.supabase
      .channel(`chat_room:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_rooms',
          filter: `id=eq.${chatRoomId}`,
        },
        (payload) => {
          onStatusChange(payload.new as ChatRoom);
        },
      )
      .subscribe();

    return channel;
  }

  // 画像をアップロードしてURLを取得
  async uploadChatImage({
    file,
    userId,
  }: {
    file: File;
    userId: string;
  }) {
    try {
      // ファイル名を生成（ユニークなIDを使用）
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const filePath = `/${userId}/${fileName}.${fileExt}`;

      // ファイルをアップロード
      const { data, error } = await this.supabase.storage
        .from('chats')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        console.error('画像アップロードエラー:', error);
        throw error;
      }

      // アップロードされたファイルのURLを生成
      const { data: urlData } = await this.supabase.storage
        .from('chats')
        .createSignedUrl(filePath, 60 * 10); // 10分間有効

      return {
        path: filePath,
        url: urlData?.signedUrl || null,
      };
    } catch (error) {
      console.error('Error uploading chat image:', error);
      throw error;
    }
  }
}
