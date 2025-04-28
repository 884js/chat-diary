import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  hideFooter?: boolean;
}

export default function Layout({
  children,
  title,
  showBackButton,
  onBackClick,
  hideFooter = false,
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header
        title={title}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
      />
      <main className="flex-1 py-6">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
