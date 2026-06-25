import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { Task, Priority } from "../../types/task.types";

export interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-green-500",
};

const PRIORITY_RING_CLASSES: Record<Priority, string> = {
  high: "ring-red-500/30 dark:ring-red-500/20",
  medium: "ring-amber-500/30 dark:ring-amber-500/20",
  low: "ring-green-500/30 dark:ring-green-500/20",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "No date set";
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) return "No date set";
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex items-start gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/[0.08] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:shadow-black/30 sm:p-6 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onToggleComplete(task.id)}
        className="mt-1 shrink-0 text-xl transition-transform hover:scale-110"
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? "☑" : "☐"}
      </button>

      <span
        aria-label={PRIORITY_LABEL[task.priority]}
        title={PRIORITY_LABEL[task.priority]}
        className={`mt-2 h-3 w-3 shrink-0 rounded-full ring-4 transition-transform duration-200 ease-out group-hover:scale-110 ${PRIORITY_DOT_CLASSES[task.priority]} ${PRIORITY_RING_CLASSES[task.priority]}`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <h3
          className={`truncate text-lg font-medium leading-snug sm:text-xl ${
            task.completed
              ? "text-neutral-400 line-through dark:text-neutral-500"
              : "text-neutral-900 dark:text-neutral-100"
          }`}
        >
          {task.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={
              task.deadline
                ? "rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                : "rounded-full bg-neutral-50 px-3 py-1 text-neutral-400 dark:bg-neutral-700/50 dark:text-neutral-500"
            }
          >
            {formatDeadline(task.deadline)}
          </span>

          {task.time && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
              {task.time}
            </span>
          )}

          <span className="rounded-full bg-neutral-50 px-3 py-1 text-neutral-500 dark:bg-neutral-700/50 dark:text-neutral-400">
            {task.estimatedEffort}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="shrink-0 rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}