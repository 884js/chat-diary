import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';

type CalendarMessageProps = {
  message: {
    id: string;
    content: string | null;
    created_at: string;
    image_path?: string | null;
  };
  isExpanded: boolean;
  onToggleExpand: (messageId: string) => void;
  isLast: boolean;
};

export const CalendarMessage = ({
  message,
  isExpanded,
  onToggleExpand,
  isLast,
}: CalendarMessageProps) => {
  const messageTime = format(parseISO(message.created_at), 'HH:mm');
  const content = message.content || '（無題）';

  return (
    <div>
      <div className="text-sm text-slate-800">
        <span className="text-slate-500 mr-2 font-medium">{messageTime}</span>
        <div
          className={clsx(
            'inline leading-relaxed',
            !isExpanded && 'line-clamp-3',
          )}
        >
          {content}
        </div>
      </div>

      {content.length > 100 && (
        <button
          type="button"
          onClick={() => onToggleExpand(message.id)}
          className="text-xs text-indigo-500/70 mt-2 hover:text-indigo-500 hover:underline transition-colors"
        >
          {isExpanded ? '閉じる' : '続きを読む'}
        </button>
      )}

      {message.image_path && (
        <div className="flex items-center gap-1 mt-2">
          <span className="text-xs text-indigo-500/70 hover:text-indigo-500 transition-colors">
            画像あり
          </span>
        </div>
      )}

      {!isLast && <div className="h-px w-full bg-slate-100 my-3" />}
    </div>
  );
};
