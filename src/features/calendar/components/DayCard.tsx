import { Button } from '@/components/ui/Button';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { CalendarMessage } from './CalendarMessage';

type DayCardProps = {
  day: {
    id: string;
    date: string;
    summary: string | null;
  };
  messages: Array<{
    id: string;
    content: string | null;
    created_at: string;
    image_path?: string | null;
  }>;
  expandedMessageIds: string[];
  isExpandedDay: boolean;
  onToggleExpandMessage: (messageId: string) => void;
  onToggleExpandDay: (dateKey: string) => void;
  onSummarize: (dateKey: string) => Promise<void>;
};

export const DayCard = ({
  day,
  messages,
  expandedMessageIds,
  isExpandedDay,
  onToggleExpandMessage,
  onToggleExpandDay,
  onSummarize,
}: DayCardProps) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const dateKey = day.date;
  const formattedDate = format(parseISO(day.date), 'M月d日(eee)', {
    locale: ja,
  });
  const summary = day.summary || '';
  const displayedMessages = isExpandedDay ? messages : messages.slice(0, 3);

  const handleSummarize = async () => {
    setIsGeneratingSummary(true);
    try {
      await onSummarize(dateKey);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden border-slate-200 bg-white hover:shadow-sm transition-shadow duration-200">
      <div className="px-5 py-4 bg-ivory-100 border-b border-slate-100">
        <h3 className="font-medium text-slate-700">{formattedDate}</h3>
      </div>

      <div className="p-5">
        {summary && (
          <div className="mb-5 p-4 bg-indigo-50/60 rounded-md border border-indigo-100">
            <h4 className="text-sm font-medium text-indigo-700 mb-2">
              この日の要約
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="border-b border-slate-100 pb-4 mb-4 space-y-4">
          {displayedMessages.map((message, index) => (
            <CalendarMessage
              key={message.id}
              message={message}
              isExpanded={expandedMessageIds.includes(message.id)}
              onToggleExpand={onToggleExpandMessage}
              isLast={index === displayedMessages.length - 1}
            />
          ))}
        </div>

        {/* さらに見る/閉じるボタン */}
        {messages.length > 3 && (
          <div className="text-center mt-4 mb-2">
            <button
              type="button"
              onClick={() => onToggleExpandDay(dateKey)}
              className="text-xs text-indigo-500/70 hover:text-indigo-500 hover:underline transition-colors"
            >
              {isExpandedDay ? '閉じる' : `さらに${messages.length - 3}件表示`}
            </button>
          </div>
        )}

        <div className="text-right mt-5">
          <Button
            variant="outline"
            size="sm"
            className="text-sm px-3 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition-colors"
            onClick={handleSummarize}
            disabled={isGeneratingSummary}
          >
            {isGeneratingSummary ? '要約中...' : '要約する'}
          </Button>
        </div>
      </div>
    </div>
  );
};
