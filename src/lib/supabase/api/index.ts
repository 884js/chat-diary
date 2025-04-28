import type { SupabaseClient } from '@supabase/supabase-js';
import { ChatRoomApi } from './ChatRoom';
import { CalendarApi } from './calendar';
import { ChatSettingApi } from './chatSetting';
import { UserApi } from './user';
export class SupabaseApi {
  constructor(private supabase: SupabaseClient) {}

  public user = new UserApi(this.supabase);
  public chatSetting = new ChatSettingApi(this.supabase);
  public chatRoom = new ChatRoomApi(this.supabase);
  public calendar = new CalendarApi(this.supabase);
}
