'use client';

import { useKeyboard } from '@/contexts/KeyboardContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiCalendar, FiHome, FiSearch, FiSettings } from 'react-icons/fi';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isKeyboardVisible } = useKeyboard();

  // チャット画面では表示しない
  if (pathname.startsWith('/chat')) {
    return null;
  }

  // 各ナビゲーション項目の情報
  const navItems = [
    {
      name: 'Times',
      href: '/',
      icon: FiHome,
      active: pathname === '/',
    },
    {
      name: 'カレンダー',
      href: '/calendar',
      icon: FiCalendar,
      active: pathname === '/calendar',
    },
    {
      name: '探す',
      href: '/inbox',
      icon: FiSearch,
      active: pathname.startsWith('/inbox'),
    },
    {
      name: '設定',
      href: '/settings',
      icon: FiSettings,
      active: pathname.startsWith('/settings'),
    },
  ];

  return (
    <div
      className={`fixed left-0 right-0 z-40 bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
        isKeyboardVisible
          ? 'translate-y-full opacity-0'
          : 'translate-y-0 opacity-100 bottom-0'
      }`}
    >
      <div className="flex items-center justify-around h-16 md:max-w-5xl md:min-w-5xl md:mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            tabIndex={-1}
            className={`flex flex-col items-center justify-center w-full h-full outline-none ${
              item.active ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <item.icon
                className={`h-6 w-6 ${
                  item.active ? 'text-blue-600' : 'text-gray-500'
                }`}
              />
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
      {/* iPhoneのセーフエリア対応 */}
      <div className="h-safe-area-bottom bg-white" />
    </div>
  );
}
