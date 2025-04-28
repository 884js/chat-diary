'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Image from 'next/image';
import { SectionHeader } from './SectionHeader';

export function AccountSettings() {
  const { signOut } = useAuth();
  const { currentUser } = useCurrentUser();

  // ログアウト処理
  const handleLogout = async () => {
    await signOut();
  };

  if (!currentUser)
    return (
      <Card>
        <SectionHeader
          title="アカウント情報"
          description="Xアカウントで連携しているプロフィール情報です"
        />
        <Loader />
      </Card>
    );

  // ユーザー情報を取得
  const userMetadata = currentUser.user_metadata;
  const userName = userMetadata?.full_name || userMetadata?.name || 'ユーザー';
  const userHandle =
    userMetadata?.preferred_username || userMetadata?.user_name || '';
  const avatarUrl =
    userMetadata?.avatar_url || userMetadata?.picture || '/default-avatar.png';

  return (
    <Card>
      <SectionHeader
        title="アカウント情報"
        description="Xアカウントで連携しているプロフィール情報です"
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full mx-auto sm:mx-0">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={userName}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 64px, 80px"
              />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold">{userName}</h2>
            {userHandle && <p className="text-gray-500">@{userHandle}</p>}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium mb-2">アカウント操作</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto border-gray-200"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
