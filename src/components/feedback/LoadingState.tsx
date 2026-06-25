// LoadingState.tsx
import { motion } from "framer-motion";

const SKELETON_CARD_COUNT = 3;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function SkeletonCard() {
  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 sm:p-6"
    >
      <div className="mt-2 h-3 w-3 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="h-5 w-3/5 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-700/70" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-700/70" />
          <div className="h-6 w-14 animate-pulse rounded-full bg-neutral-50 dark:bg-neutral-700/40" />
        </div>
      </div>
    </motion.div>
  );
}

export function LoadingState() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex w-full flex-col gap-4">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </motion.div>
  );
}