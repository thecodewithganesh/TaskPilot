// CaptureBar.tsx
import { useCallback, useState, type KeyboardEvent } from "react";
import { CaptureInput } from "./CaptureInput";
import { CaptureButton } from "./CaptureButton";
import type { CaptureStatus } from "../../types/task.types";

export interface CaptureBarProps {
  status: CaptureStatus;
  captureTask: (rawInput: string) => Promise<void>;
}

export function CaptureBar({ status, captureTask }: CaptureBarProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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
      <CaptureInput value={input} onChange={setInput} disabled={isLoading} />
      <CaptureButton
        onClick={() => void handleSubmit()}
        loading={isLoading}
        disabled={input.trim().length === 0}
      />
    </div>
  );
}