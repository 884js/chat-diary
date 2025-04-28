'use client';
import { Logo } from '@/components/ui/Logo';
import { useKeyboard } from '@/contexts/KeyboardContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isChat = pathname.startsWith('/chat');
  const { isKeyboardVisible } = useKeyboard();

  // チャット画面以外のモバイル画面ではボトムナビゲーションの高さを考慮したパディングを追加
  const paddingClass = !isChat ? 'pb-24 md:pb-8' : 'pb-8';

  return (
    <footer
      className={`bg-white border-t border-gray-100 py-6 md:py-8 ${paddingClass} transition-all duration-300 ease-in-out ${
        isKeyboardVisible
          ? 'opacity-0 transform translate-y-full pointer-events-none'
          : 'opacity-100 transform translate-y-0'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="mb-4 md:mb-6">
          <Logo size="sm" />
        </div>
        <div className="flex gap-4 mb-4 text-sm">
          <Link
            href="/privacy-policy"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            利用規約
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} チャット日記（仮）. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
