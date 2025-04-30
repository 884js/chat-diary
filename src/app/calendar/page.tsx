'use client';

import { CalendarGrid } from '@/features/calendar/components/CalendarGrid';
import { CalendarHeader } from '@/features/calendar/components/CalendarHeader';
import { EmptyCalendar } from '@/features/calendar/components/EmptyCalendar';
import { useCalendarDays } from '@/features/calendar/hooks/useCalendar';
import { useSummarize } from '@/features/calendar/hooks/useSummarize';
import { useUpdateCalendarSummary } from '@/features/calendar/hooks/useUpdateCalendarSummary';
import { useChatRoomMessages } from '@/features/chat/hooks/useChatRoomMessages';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { dateWithTZ } from '@/lib/date-fns';
import {
  addMonths,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { useMemo, useState } from 'react';

export default function CalendarPage() {
  const { currentUser } = useCurrentUser();
  const { summarize } = useSummarize();
  const { updateCalendarSummary } = useUpdateCalendarSummary();
  const [currentDate, setCurrentDate] = useState(() => dateWithTZ(new Date()));
  const [expandedMessageIds, setExpandedMessageIds] = useState<string[]>([]);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);

  const startAt = startOfMonth(currentDate).toISOString();
  const endAt = endOfMonth(currentDate).toISOString();

  const { chatRoomMessages, isLoading: isMessagesLoading } =
    useChatRoomMessages({
      userId: currentUser?.id || '',
      startAt,
      endAt,
    });

  const {
    calendarDays,
    isLoading: isCalendarDaysLoading,
    refetch: refetchCalendarDays,
  } = useCalendarDays({
    userId: currentUser?.id || '',
    startAt,
    endAt,
  });

  const messagesByDate = useMemo(() => {
    if (!chatRoomMessages) return {};
    const grouped: Record<string, typeof chatRoomMessages> = {};
    for (const msg of chatRoomMessages) {
      const dateKey = format(parseISO(msg.created_at), 'yyyy-MM-dd');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    }
    return grouped;
  }, [chatRoomMessages]);

  const handleSummarize = async (dateKey: string) => {
    const dayMessages = messagesByDate[dateKey] || [];

    const messagesText = dayMessages
      .map((m) => m.content?.trim())
      .filter((c) => c && c.length > 0)
      .join('\n');

    if (!messagesText) {
      console.warn('この日には要約するメッセージがありません');
      return;
    }

    const result = await summarize({ messagesText });
    console.log(result);

    await updateCalendarSummary({
      userId: currentUser?.id || '',
      dateKey,
      json: result,
    });
    refetchCalendarDays();
  };

  const toggleExpandMessage = (messageId: string) => {
    setExpandedMessageIds((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    );
  };

  const toggleExpandDay = (dateKey: string) => {
    setExpandedDays((prev) =>
      prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey],
    );
  };

  const goToPreviousMonth = () => setCurrentDate((prev) => addMonths(prev, -1));
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const isLoading = isMessagesLoading || isCalendarDaysLoading;
  const hasDays = calendarDays.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500/70" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-10 max-w-4xl overflow-y-auto min-h-dvh bg-ivory-50">
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
      />

      {!hasDays && <EmptyCalendar />}

      {hasDays && (
        <CalendarGrid
          calendarDays={calendarDays}
          messagesByDate={messagesByDate}
          expandedMessageIds={expandedMessageIds}
          expandedDays={expandedDays}
          onToggleExpandMessage={toggleExpandMessage}
          onToggleExpandDay={toggleExpandDay}
          onSummarize={handleSummarize}
        />
      )}
    </div>
  );
}
