import { useEffect, useState } from "react";
import { Mic, Send } from "lucide-react";

interface AssistantInputProps {
  onSend: (message: string) => void;
  listening: boolean;
  onStartListening: () => void;
  voiceText: string;
}

export function AssistantInput({
  onSend,
  listening,
  onStartListening,
  voiceText,
}: AssistantInputProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (voiceText) {
      setText(voiceText);
    }
  }, [voiceText]);

  function handleSend() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="mt-5 flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="Ask TaskPilot AI..."
        className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:px-4 sm:text-base"
      />

      <button
        type="button"
        onClick={onStartListening}
        className={`shrink-0 rounded-xl p-3 transition ${
          listening
            ? "animate-pulse bg-red-500 text-white"
            : "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
        }`}
      >
        <Mic size={18} />
      </button>

      <button
        type="button"
        onClick={handleSend}
        className="shrink-0 rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700"
      >
        <Send size={20} />
      </button>
    </div>
  );
}