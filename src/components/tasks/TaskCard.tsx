import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { Task, Priority } from "../../types/task.types";
import { createGoogleCalendarUrl } from "../../utils/googleCalendar";
import {
  isTaskOverdue,
  getSuggestedReschedule,
} from "../../utils/rescheduler";

export interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onReschedule: (id: string, newDate: string) => void;
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

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No date set";

  const parsed = new Date(deadline);

  if (Number.isNaN(parsed.getTime())) return "No date set";

  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onReschedule,
}: TaskCardProps) {
  const googleCalendarUrl = createGoogleCalendarUrl(task);
  const overdue = isTaskOverdue(task);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35 }}
      className={`group flex items-start gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className="mt-1 text-xl"
      >
        {task.completed ? "☑" : "☐"}
      </button>

      <span
        className={`mt-2 h-3 w-3 rounded-full ring-4 ${PRIORITY_DOT_CLASSES[task.priority]} ${PRIORITY_RING_CLASSES[task.priority]}`}
        title={PRIORITY_LABEL[task.priority]}
      />

      <div className="flex-1">
        <h3
          className={`text-lg font-semibold ${
            task.completed
              ? "line-through text-neutral-400"
              : "text-neutral-900 dark:text-white"
          }`}
        >
          {task.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-700">
            {formatDeadline(task.deadline)}
          </span>

          {task.time && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-700">
              {task.time}
            </span>
          )}

          <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-700">
            {task.estimatedEffort}
          </span>
        </div>

        {task.deadline && (
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            📅 Add to Google Calendar
          </a>
        )}

        {overdue && (
          <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
            <h3 className="font-semibold text-red-600">
              ⚠️ Missed Deadline
            </h3>

            <p className="mt-2 text-sm text-red-500">
              AI Recommendation:
            </p>

            <p className="mt-1 text-sm">
              Move this task to tomorrow and complete it first.
            </p>

            <p className="mt-2 text-xs text-neutral-500">
              Suggested Date:{" "}
              {new Date(getSuggestedReschedule()).toLocaleDateString()}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);

                  onReschedule(task.id, tomorrow.toISOString());
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Tomorrow
              </button>

              <button
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);

                  onReschedule(task.id, nextWeek.toISOString());
                }}
                className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Next Week
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="rounded-full p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}