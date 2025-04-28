import { DayCard } from './DayCard';

type CalendarGridProps = {
  calendarDays: Array<{
    id: string;
    date: string;
    summary: string | null;
  }>;
  messagesByDate: Record<
    string,
    Array<{
      id: string;
      content: string | null;
      created_at: string;
      image_path?: string | null;
    }>
  >;
  expandedMessageIds: string[];
  expandedDays: string[];
  onToggleExpandMessage: (messageId: string) => void;
  onToggleExpandDay: (dateKey: string) => void;
  onSummarize: (dateKey: string) => Promise<void>;
};

export const CalendarGrid = ({
  calendarDays,
  messagesByDate,
  expandedMessageIds,
  expandedDays,
  onToggleExpandMessage,
  onToggleExpandDay,
  onSummarize,
}: CalendarGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {calendarDays.map((day) => {
        const dateKey = day.date;
        const dayMessages = messagesByDate[dateKey] || [];
        const isExpandedDay = expandedDays.includes(dateKey);

        return (
          <DayCard
            key={day.id}
            day={day}
            messages={dayMessages}
            expandedMessageIds={expandedMessageIds}
            isExpandedDay={isExpandedDay}
            onToggleExpandMessage={onToggleExpandMessage}
            onToggleExpandDay={onToggleExpandDay}
            onSummarize={onSummarize}
          />
        );
      })}
    </div>
  );
};
