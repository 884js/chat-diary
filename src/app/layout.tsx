import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { AuthProvider } from '@/contexts/AuthContext';
import { KeyboardProvider } from '@/contexts/KeyboardContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ReactQueryProvider } from '@/provider/ReactQueryProvider';

const noto = Noto_Sans_JP({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${noto.className} bg-background text-foreground min-h-dvh`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <SnackbarProvider>
              <KeyboardProvider>
                {children}
                <MobileBottomNav />
              </KeyboardProvider>
            </SnackbarProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
