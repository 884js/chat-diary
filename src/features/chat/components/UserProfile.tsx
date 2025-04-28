import type { GetUserResponse } from '@/lib/supabase/api/user';
interface UserProfileProps {
  user: GetUserResponse;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <>
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.display_name || 'プロフィール画像'}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 mb-4"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
          {(user?.display_name || '相手').charAt(0).toUpperCase()}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {user?.display_name || '相手'}
      </h1>

      <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full my-4" />
    </>
  );
}
