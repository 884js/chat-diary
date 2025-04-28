import { Navbar } from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense>{children}</Suspense>
      <Footer />
    </>
  );
}
