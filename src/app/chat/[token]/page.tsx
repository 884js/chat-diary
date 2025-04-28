import { ChatContainer } from '@/features/chat/containers/ChatContainer';

type ChatPageProps = {
  params: {
    token: string;
  };
};

export default async function Page({ params }: ChatPageProps) {
  const { token } = params;

  return <ChatContainer token={token} />;
}
