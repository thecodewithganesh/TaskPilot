import {
  useCallback,
  useState,
  useRef,
  type KeyboardEvent,
} from "react";
import { CaptureInput } from "./CaptureInput";
import { CaptureButton } from "./CaptureButton";
import type { CaptureStatus } from "../../types/task.types";
import { Mic } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface CaptureBarProps {
  status: CaptureStatus;
  captureTask: (rawInput: string) => Promise<void>;
}

export function CaptureBar({ status, captureTask }: CaptureBarProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const lastTranscriptRef = useRef("");
  const recognitionRef = useRef<any>(null);

  const isLoading = status === "loading";

  const handleSubmit = useCallback(async () => {
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0 || isLoading) {
      return;
    }
    await captureTask(trimmedInput);
    setInput("");
  }, [input, isLoading, captureTask]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit],
  );

  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
  recognitionRef.current.stop();
  recognitionRef.current = null;
  setIsListening(false);
  lastTranscriptRef.current = "";
  return;
}

    const recognition =
    recognitionRef.current || new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
  if (isListening) {
    recognition.start();
      }
    };
    recognition.onresult = async (event: any) => {
  const text = event.results[0][0].transcript;
  if (text === lastTranscriptRef.current) return;

  lastTranscriptRef.current = text;

  setInput(text);

  if (text.trim().length === 0) return;

  await captureTask(text);

  setInput("");
};
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  return (
    <div
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`flex w-full items-end gap-2 rounded-3xl border bg-white p-2 transition-all duration-200 ease-out sm:gap-3 ${
        isFocused
          ? "border-neutral-300 shadow-lg shadow-neutral-900/[0.06] ring-4 ring-neutral-900/[0.05]"
          : "border-neutral-200 shadow-sm hover:border-neutral-300 hover:shadow-md"
      }`}
    >
      <div className="flex flex-1 items-center gap-2">
        <CaptureInput value={input} onChange={setInput} disabled={isLoading} />
        <button
          type="button"
          onClick={startVoiceRecognition}
          disabled={isLoading || isListening}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
            isListening ? "animate-pulse ring-4 ring-red-300" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
          title="Voice Input"
        >
          <Mic size={20} />
        </button>
      </div>

      <CaptureButton
        onClick={() => void handleSubmit()}
        loading={isLoading}
        disabled={input.trim().length === 0}
      />
    </div>
  );
}