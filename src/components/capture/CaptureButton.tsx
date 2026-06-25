// CaptureButton.tsx
import { ArrowUp, Loader2 } from "lucide-react";

export interface CaptureButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function CaptureButton({ onClick, loading, disabled }: CaptureButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label="Capture task"
      className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 transition-all duration-200 ease-out hover:scale-105 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/25 active:scale-90 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none sm:h-14 sm:w-14"
    >
      <span
        className={`absolute inset-0 rounded-full bg-white/10 transition-opacity duration-200 ${
          isDisabled ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        }`}
      />
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin sm:h-5 sm:w-5" />
      ) : (
        <ArrowUp className="h-5 w-5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 sm:h-5 sm:w-5" />
      )}
    </button>
  );
}