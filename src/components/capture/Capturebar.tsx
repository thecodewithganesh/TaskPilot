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

  // #2 fix: mirror isListening in a ref so callbacks created once via
  // useCallback (empty deps) always read the CURRENT value instead of
  // a stale snapshot from when the callback was first created.
  const isListeningRef = useRef(false);
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

  // #1 fix: explicit stop function, reused by the toggle-off path and by
  // cleanup, so the "stop" branch isn't just dead code sitting behind a
  // disabled button.
  const stopVoiceRecognition = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    lastTranscriptRef.current = "";

    if (recognitionRef.current) {
      // Prevent the auto-restart in onend from firing after a deliberate stop
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  const startVoiceRecognition = useCallback(() => {
    // #1 fix: toggle off if already listening, now reading the ref
    // (always current) instead of the stale `isListening` state value.
    if (isListeningRef.current) {
      stopVoiceRecognition();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    // #5 fix: always start from a fresh instance rather than reusing a
    // possibly half-torn-down previous one.
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
    };

    recognition.onend = () => {
      // #2 fix: reads the ref, so this sees the real current state,
      // not a stale closure value. Only auto-restarts on an
      // unexpected end (e.g. silence timeout), not a deliberate stop.
      if (isListeningRef.current) {
        recognition.start();
      }
    };

    recognition.onresult = async (event: any) => {
      // #3 fix: with continuous = true, event.results accumulates every
      // phrase since start — always read the LATEST result, not index 0,
      // or speech after the first phrase is silently ignored.
      const lastIndex = event.results.length - 1;
      const text = event.results[lastIndex][0].transcript.trim();

      if (text.length === 0 || text === lastTranscriptRef.current) return;

      lastTranscriptRef.current = text;
      setInput(text);

      await captureTask(text);

      setInput("");
    };

    recognition.onerror = (event: any) => {
      // #4 fix: surface *something* about what went wrong instead of
      // failing silently — permission denials are the most common case.
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        alert("Microphone access was blocked. Please allow microphone permissions and try again.");
      }
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [captureTask, stopVoiceRecognition]);

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
          // #1 fix: only disabled while loading, NOT while listening —
          // otherwise there's no way to click again and trigger the
          // stop branch. isListening now just changes the visual style.
          disabled={isLoading}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
            isListening
              ? "animate-pulse ring-4 ring-red-300"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
          title={isListening ? "Stop voice input" : "Voice Input"}
        >
          <Mic size={20} />
        </button>
    

      <CaptureButton
        onClick={() => void handleSubmit()}
        loading={isLoading}
        disabled={input.trim().length === 0}
      />
    </div>
    </div>
  );
}
