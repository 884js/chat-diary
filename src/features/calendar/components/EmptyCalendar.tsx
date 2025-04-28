import { FiCalendar } from 'react-icons/fi';

export const EmptyCalendar = () => {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-slate-100 shadow-sm">
      <div className="text-slate-400 mb-4">
        <FiCalendar className="inline-block h-16 w-16" />
      </div>
      <p className="text-slate-700 font-medium text-lg mb-2">
        この月の投稿はありません
      </p>
      <p className="text-slate-500 max-w-sm mx-auto text-sm">
        別の月を選択するか、新しく書き始めましょう
      </p>
    </div>
  );
};
