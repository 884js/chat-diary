import { ChatContainer } from '@/features/chat/containers/ChatContainer';
import { MessageActionProvider } from '@/features/chat/contexts/MessageActionContext';

export default function Page() {
  return (
    <MessageActionProvider>
      <ChatContainer />
    </MessageActionProvider>
  );
}
