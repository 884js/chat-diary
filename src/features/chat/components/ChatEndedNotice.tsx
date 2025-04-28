interface ChatEndedNoticeProps {
  isChatEnded: boolean;
}

export function ChatEndedNotice({ isChatEnded }: ChatEndedNoticeProps) {
  if (!isChatEnded) return null;

  return (
    <div className="bg-red-50 border-b border-red-100 px-4 py-2 sticky top-[64px] z-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-red-700 font-medium">
          このチャットは終了しています
        </p>
        <p className="text-xs text-red-600">
          これ以上チャットを送信することはできません
        </p>
      </div>
    </div>
  );
}
