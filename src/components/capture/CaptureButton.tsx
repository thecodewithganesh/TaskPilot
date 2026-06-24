import { ArrowUp, Loader2 } from "lucide-react";

export interface CaptureButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function CaptureButton({
  onClick,
  loading = false,
  disabled = false,
}: CaptureButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label="Capture task"
      aria-busy={loading}
      className="
        flex
        h-14
        w-14
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-neutral-900
        text-white
        shadow-md
        transition-all
        duration-200
        ease-out
        hover:bg-neutral-800
        hover:shadow-lg
        active:scale-95
        focus:outline-none
        focus:ring-2
        focus:ring-neutral-900/20
        disabled:cursor-not-allowed
        disabled:bg-neutral-200
        disabled:text-neutral-400
        disabled:shadow-none
        disabled:active:scale-100
      "
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ArrowUp className="h-5 w-5" />
      )}
    </button>
  );
}