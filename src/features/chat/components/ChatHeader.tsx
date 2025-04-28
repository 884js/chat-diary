import { formatDate } from '@/lib/date-fns';

export function ChatHeader() {
  return (
    <header className="bg-white shadow-sm py-3 px-2 z-10 sticky top-0">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center  gap-1">
          <div>📅 今日：{formatDate(new Date(), 'yyyy年M月dd日')}</div>
        </div>
      </div>
    </header>
  );
}
