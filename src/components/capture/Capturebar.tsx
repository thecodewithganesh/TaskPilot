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
      className="flex w-full items-end gap-3 rounded-3xl border border-neutral-200 bg-white p-2 shadow-sm"
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