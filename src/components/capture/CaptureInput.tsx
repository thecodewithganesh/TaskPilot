import { useEffect, useRef, useState } from "react";

export interface CaptureInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PLACEHOLDER_EXAMPLES = [
  "What do you need to remember?",
  "Math assignment due Friday",
  "Dentist appointment Thursday 5 PM",
  "Interview June 30 at 10 AM",
];

const PLACEHOLDER_ROTATION_MS = 2800;
const MIN_HEIGHT_PX = 64;
const MAX_HEIGHT_PX = 200;

export function CaptureInput({
  value,
  onChange,
  disabled = false,
}: CaptureInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPlaceholderIndex(
        (previousIndex) =>
          (previousIndex + 1) % PLACEHOLDER_EXAMPLES.length
      );
    }, PLACEHOLDER_ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      Math.max(textarea.scrollHeight, MIN_HEIGHT_PX),
      MAX_HEIGHT_PX
    )}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      autoFocus
      spellCheck={false}
      aria-label="Task input"
      value={value}
      disabled={disabled}
      rows={1}
      placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
      style={{ minHeight: `${MIN_HEIGHT_PX}px` }}
      onChange={(event) => onChange(event.target.value)}
      className="
        w-full
        resize-none
        overflow-y-auto
        rounded-3xl
        border
        border-neutral-200
        bg-white
        px-5
        py-4
        text-base
        text-neutral-900
        placeholder-neutral-400
        shadow-sm
        outline-none
        transition-all
        duration-150
        focus:border-neutral-300
        focus:ring-2
        focus:ring-neutral-900/10
        disabled:cursor-not-allowed
        disabled:bg-neutral-50
        disabled:text-neutral-400
        sm:text-lg
      "
    />
  );
}