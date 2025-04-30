import { ChatContainer } from '@/features/chat/containers/ChatContainer';
import { EditMessageProvider } from '@/features/chat/contexts/EditMessageContext';
export default function Page() {
  return (
    <EditMessageProvider>
      <ChatContainer />
    </EditMessageProvider>
  );
}
