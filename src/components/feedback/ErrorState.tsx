// ErrorState.tsx
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full flex-col items-center gap-5 rounded-3xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 sm:px-10 sm:py-12"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 sm:h-16 sm:w-16">
        <AlertTriangle className="h-6 w-6 text-red-500 sm:h-7 sm:w-7" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 sm:text-xl">
          Something went wrong
        </h3>
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:bg-neutral-800 hover:shadow-md active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}