import { Button } from '@/components/ui/Button';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { CalendarMessage } from './CalendarMessage';
import { FiCheck, FiStar } from 'react-icons/fi';

type DayCardProps = {
  day: {
    id: string;
    date: string;
    ai_generated_highlights: {
      good: string[];
      new: string[];
    };
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

  const aiGeneratedHighlights = day.ai_generated_highlights || {
    good: [],
    new: [],
  };
  const displayedMessages = isExpandedDay ? messages : messages.slice(0, 3);

  const handleSummarize = async () => {
    setIsGeneratingSummary(true);
    try {
      await onSummarize(dateKey);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const hasHighlights =
    aiGeneratedHighlights.good.length > 0 ||
    aiGeneratedHighlights.new.length > 0;

  return (
    <div className="border rounded-lg overflow-hidden border-slate-200 bg-white hover:shadow-sm transition-shadow duration-200">
      <div className="px-5 py-4 bg-ivory-100 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-medium text-slate-700">{formattedDate}</h3>
        {!hasHighlights && (
          <Button
            variant="outline"
            size="sm"
            className="text-sm px-3 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition-colors"
            onClick={handleSummarize}
            disabled={isGeneratingSummary}
        >
            {isGeneratingSummary ? '整理中...' : '整理する'}
          </Button>
        )}
      </div>

      <div className="p-5">
        {hasHighlights && (
          <div className="mb-5 rounded-md">
            <h4 className="text-sm font-medium text-indigo-700 mb-2">
              この日のできごと
            </h4>

            {aiGeneratedHighlights.good.length > 0 && (
              <div className="p-4 mb-3 bg-green-50/60 rounded-md border border-green-100">
                <div className="flex items-center mb-2">
                  <FiCheck className="text-green-600 mr-1" />
                  <h5 className="text-sm font-medium text-green-700">
                    良かったこと
                  </h5>
                </div>
                <ul className="pl-6 list-disc text-sm text-slate-700">
                  {aiGeneratedHighlights.good.map((item, index) => (
                    <li key={`good-${item}`} className="mb-1 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiGeneratedHighlights.new.length > 0 && (
              <div className="p-4 bg-blue-50/60 rounded-md border border-blue-100">
                <div className="flex items-center mb-2">
                  <FiStar className="text-blue-600 mr-1" />
                  <h5 className="text-sm font-medium text-blue-700">
                    新しいこと
                  </h5>
                </div>
                <ul className="pl-6 list-disc text-sm text-slate-700">
                  {aiGeneratedHighlights.new.map((item, index) => (
                    <li key={`new-${item}`} className="mb-1 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              {isExpandedDay ? "閉じる" : `さらに${messages.length - 3}件表示`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
