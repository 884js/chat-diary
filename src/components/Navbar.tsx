'use client';

import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiSettings,
  FiX,
} from 'react-icons/fi';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // ドロワーを開閉する
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // ドロワー外のクリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };

    // ESCキーで閉じる
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      // スクロール無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      // スクロール有効化
      document.body.style.overflow = 'auto';
    };
  }, [drawerOpen]);

  // ページ遷移時にドロワーを閉じる
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // ユーザーのメタデータから情報を取得
  const userMetadata = user?.user_metadata;
  const userName = userMetadata?.full_name || userMetadata?.name || 'ユーザー';
  const avatarUrl =
    userMetadata?.avatar_url || userMetadata?.picture || '/default-avatar.png';

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-2 lg:px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Logo size="sm" />
              </Link>
            </div>

            {/* デスクトップナビゲーション */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <>
                  <Link
                    href="/home"
                    className={`px-3 py-2 text-sm font-medium ${
                      pathname === '/home'
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    マイチャット
                  </Link>
                  <Link
                    href="/inbox"
                    className={`px-3 py-2 text-sm font-medium relative ${
                      pathname === '/inbox'
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    チャット一覧
                  </Link>
                  <Link
                    href="/settings"
                    className={`px-3 py-2 text-sm font-medium ${
                      pathname === '/settings'
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    設定
                  </Link>
                  <div className="ml-3 relative flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={avatarUrl}
                        alt={userName}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {userName}
                    </span>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="ml-4 text-xs text-gray-500 hover:text-red-500"
                    >
                      ログアウト
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-primary hover:bg-primary/5 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ログイン
                </Link>
              )}
            </div>

            {/* モバイルメニューボタン */}
            <div className="flex items-center sm:hidden">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={toggleDrawer}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 focus:outline-none"
                    aria-expanded={drawerOpen}
                  >
                    <span className="sr-only">
                      {drawerOpen ? 'メニューを閉じる' : 'メニューを開く'}
                    </span>
                    {drawerOpen ? (
                      <FiX className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <FiMenu className="h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-primary hover:bg-primary/5 rounded-md text-sm font-medium"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ドロワーメニューの背景オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 z-30 transition-opacity duration-300 sm:hidden ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setDrawerOpen(false);
          }
        }}
        aria-hidden="true"
      />

      {/* ドロワーメニュー */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 w-90 max-w-[90vw] bg-white shadow-xl z-100 transform transition-transform duration-300 ease-in-out sm:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        tabIndex={drawerOpen ? 0 : -1}
        aria-label="メインメニュー"
        aria-modal="true"
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* ドロワーヘッダー */}
          <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
            <Logo size="sm" />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="text-gray-500 hover:text-primary focus:outline-none"
              aria-label="メニューを閉じる"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* ドロワーコンテンツ */}
          <div className="flex-1 py-2">
            {user ? (
              <>
                {/* ユーザープロフィール */}
                <div className="px-4 py-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={avatarUrl}
                        alt={userName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">ログイン中</p>
                    </div>
                  </div>
                </div>

                {/* ナビゲーションリンク */}
                <nav className="mt-2 space-y-1">
                  <Link
                    href="/home"
                    className={`px-4 py-3 flex items-center text-sm font-medium rounded-md relative ${
                      pathname === '/home'
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiMessageSquare className="mr-3 h-5 w-5" />
                    マイチャット
                  </Link>
                  <Link
                    href="/inbox"
                    className={`px-4 py-3 flex items-center text-sm font-medium rounded-md relative ${
                      pathname === '/inbox'
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiMessageSquare className="mr-3 h-5 w-5" />
                    チャット一覧
                  </Link>
                  <Link
                    href="/settings"
                    className={`px-4 py-3 flex items-center text-sm font-medium rounded-md ${
                      pathname === '/settings'
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiSettings className="mr-3 h-5 w-5" />
                    設定
                  </Link>
                </nav>
              </>
            ) : (
              <div className="px-4 py-3">
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 rounded-md bg-primary text-white font-medium hover:bg-primary/90"
                >
                  ログイン
                </Link>
              </div>
            )}
          </div>

          {/* ドロワーフッター */}
          {user && (
            <div className="px-4 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setDrawerOpen(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
