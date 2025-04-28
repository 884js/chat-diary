import { useCallback, useRef } from 'react';

export const useAutoScrollBottom = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleScrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: 'end',
      });
    }
  }, []);

  return { messagesEndRef, handleScrollToBottom };
};
