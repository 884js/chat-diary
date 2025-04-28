import { Navbar } from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { Logo } from '@/components/ui/Logo';
import { HowToUse } from '@/features/top/components/HowToUse';
import { SupabaseApi } from '@/lib/supabase/api';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { FiMessageSquare } from 'react-icons/fi';

export default async function Page() {
  const supabase = await createClient();
  const api = new SupabaseApi(supabase);
  const currentUser = await api.user.getCurrentUser();

  if (currentUser) {
    redirect('/home');
  }

  return (
    <Container>
      <div className="text-center max-w-xl w-full mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12 animate-fade-in-down">
          <div className="mb-4 inline-block p-2 bg-indigo-100 rounded-full transition-transform hover:scale-105">
            <FiMessageSquare className="h-8 w-8 md:h-10 md:w-10 text-indigo-600" />
          </div>
          <div className="mb-6">
            <Logo />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            チャット日記（仮）
          </h1>
          <p className="text-gray-600 mb-6 px-2 md:px-4 text-base md:text-lg leading-relaxed text-left">
            チャット日記（仮）で、日記をシェアしよう。
          </p>
          <div className="w-20 md:w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-8" />
        </div>
      </div>
      <div className="mt-12 w-full max-w-5xl px-4 md:px-6">
        <HowToUse />
      </div>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-content py-8 md:py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        {children}
      </div>
      <Footer />
    </>
  );
};
