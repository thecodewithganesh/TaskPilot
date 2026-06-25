// EmptyState.tsx
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

const TIP_EXAMPLES = [
  "Math assignment due Friday",
  "Dentist appointment Thursday 5 PM",
  "Interview June 30 at 10 AM",
];

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full flex-col items-center gap-6 rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm transition-shadow duration-200 ease-out hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:shadow-black/20 sm:px-10 sm:py-16"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 sm:h-20 sm:w-20">
        <ClipboardList className="h-8 w-8 text-neutral-400 dark:text-neutral-400 sm:h-9 sm:w-9" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 sm:text-xl">
          Nothing captured yet
        </h3>
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
          Type what&apos;s on your mind. TaskPilot will organize it for you.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2 rounded-2xl bg-neutral-50 px-5 py-4 text-left dark:bg-neutral-900/40">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">💡 Try:</span>
        <ul className="flex flex-col gap-1.5">
          {TIP_EXAMPLES.map((example) => (
            <li key={example} className="text-sm text-neutral-500 dark:text-neutral-400">
              • {example}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}