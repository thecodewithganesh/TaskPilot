interface ChatMessageProps {
  sender: "user" | "ai";
  message: string;
}

export function ChatMessage({
  sender,
  message,
}: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
        }`}
      >
        {message}
      </div>
    </div>
  );
}