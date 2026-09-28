import type { Message } from "../types/chat";

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words sm:max-w-[75%] ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-zinc-100 text-zinc-900 rounded-bl-sm dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-70">
          {isUser ? "Tú" : "IA"}
        </span>
        {message.content}
      </div>
    </div>
  );
}
