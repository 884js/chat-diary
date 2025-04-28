'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';

// メインのダイアログコンポーネント
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // Dialog コンポーネントは単純にpropsを渡すだけの役割
  return <>{open && children}</>;
}

// ダイアログのコンテンツを表示するコンポーネント
interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({
  children,
  className = '',
}: DialogContentProps) {
  // 親コンポーネントから直接propsを受け取る
  const dialogRef = useRef<HTMLDialogElement>(null);

  // クライアントサイドでのみレンダリング
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* ダイアログ本体 */}
      <dialog
        ref={dialogRef}
        className={`relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 z-10 overflow-hidden ${className}`}
        open
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {children}
      </dialog>
    </div>,
    document.body,
  );
}

// ダイアログのヘッダー
interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>;
}

// ダイアログのタイトル
interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2
      id="dialog-title"
      className={`text-xl font-semibold text-gray-900 ${className}`}
    >
      {children}
    </h2>
  );
}

// ダイアログの説明
interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({
  children,
  className = '',
}: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 mt-2 ${className}`}>{children}</p>
  );
}

// ダイアログのフッター
interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 flex justify-end space-x-2 ${className}`}
    >
      {children}
    </div>
  );
}
