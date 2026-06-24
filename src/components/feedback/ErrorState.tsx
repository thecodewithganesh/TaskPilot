import { AlertTriangle } from "lucide-react";

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
      <AlertTriangle className="h-6 w-6 text-red-500" />

      <p className="text-sm text-neutral-600 sm:text-base">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}