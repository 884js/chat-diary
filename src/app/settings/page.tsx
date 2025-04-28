import { AccountSettings, ChatSettings } from '@/features/setting/components';
import { verifySession } from '@/lib/next/verifySession';

export default async function Page() {
  await verifySession();

  return (
    <>
      <div className="flex min-h-content flex-col">
        <main className="flex flex-1 flex-col p-3 md:p-6 max-w-3xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6 px-1">設定</h1>
          {/* アカウント設定 */}
          <AccountSettings />
          {/* チャット設定 */}
          <ChatSettings />
        </main>
      </div>
    </>
  );
}
