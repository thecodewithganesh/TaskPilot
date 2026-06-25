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

const PLACEHOLDER_ROTATION_MS = 3000;
const MIN_HEIGHT_PX = 64;

export function CaptureInput({
  value,
  onChange,
  disabled,
}: CaptureInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPlaceholderIndex(
        (previousIndex) =>
          (previousIndex + 1) % PLACEHOLDER_EXAMPLES.length,
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
    textarea.style.height = `${Math.max(
      textarea.scrollHeight,
      MIN_HEIGHT_PX,
    )}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      rows={1}
      placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
      style={{ minHeight: `${MIN_HEIGHT_PX}px` }}
      className="
      w-full
      resize-none
      bg-transparent
      px-5
      py-4
      text-base
      text-neutral-900
      placeholder:text-neutral-400
      outline-none
      transition-all
      duration-200
      disabled:cursor-not-allowed
      disabled:text-neutral-400
      sm:text-lg
      "
    />
  );
}