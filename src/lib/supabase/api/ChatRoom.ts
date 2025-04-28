import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../databaseTypes';

export class ChatRoomApi {
  constructor(private supabase: SupabaseClient<Database>) {}

  async findActiveChatRoomBetweenUsers(receiverId: string) {
    const currentUser = await this.supabase.auth.getUser();

    if (!currentUser.data.user?.id) {
      throw new Error('User not found');
    }

    const { data, error } = await this.supabase
      .from('rooms')
      .select('*')
      .eq('sender_id', currentUser.data.user.id)
      .eq('receiver_id', receiverId)
      .eq('status', 'open')
      .maybeSingle();

    if (error) {
      console.error('Chat room fetch error:', error);
      throw error;
    }

    return data;
  }

  // ユーザーのデフォルトチャットルームを取得
  async getDefaultChatRoom(userId: string) {
    const { data, error } = await this.supabase
      .from('rooms')
      .select('*, users(id, display_name, avatar_url)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Default chat room fetch error:', error);
      throw error;
    }

    return data;
  }

  async getUnreadChatRoomList({
    userId,
  }: {
    userId: string;
  }) {
    const query = this.supabase
      .from('rooms')
      .select(
        'id, status, is_read_by_receiver, is_read_by_sender, receiver_id, sender_id',
      )
      .eq('status', 'open');

    query.or(`receiver_id.eq.${userId},sender_id.eq.${userId}`);
    query.eq('is_read_by_sender', false);

    const { data, error } = await query;
    console.log('data', data);

    if (error) {
      console.error('Chat room fetch error:', error);
      throw error;
    }

    return data;
  }
}
