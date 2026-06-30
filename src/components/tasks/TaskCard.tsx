import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { Task, Priority } from "../../types/task.types";
import { createGoogleCalendarUrl } from "../../utils/googleCalendar";
import {
  isTaskOverdue,
  getSuggestedReschedule,
} from "../../utils/rescheduler";
import { getReminderMinutes } from "../../utils/reminderPreference";

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

  const [remaining, setRemaining] = useState("");

useEffect(() => {
  function updateRemaining() {
    if (!task.deadline || !task.time) {
      setRemaining(task.estimatedEffort);
      return;
    }

    const target = new Date(`${task.deadline} ${task.time}`);
    const now = new Date();

   const reminder = getReminderMinutes();

const diff =
  target.getTime() -
  now.getTime() -
  reminder * 60 * 1000;

    if (diff <= 0) {
      setRemaining("Starting now");
      return;
    }

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hrs > 0) {
      setRemaining(`${hrs} hr ${mins} min left`);
    } else {
      setRemaining(`${mins} min left`);
    }
  }

  updateRemaining();

  const interval = setInterval(updateRemaining, 60000);

  return () => clearInterval(interval);
}, [task.deadline, task.time, task.estimatedEffort]);

  

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
     transition={{
  type: "spring",
  stiffness: 260,
  damping: 20,
}}
     className={`group flex items-start gap-4 rounded-[28px]
border border-white/30
bg-white/75
backdrop-blur-xl
p-6
shadow-xl
transition-all
duration-300
hover:-translate-y-1
hover:shadow-2xl
dark:border-neutral-700
dark:bg-neutral-900/70
${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-lg transition hover:scale-110 dark:bg-blue-900/40"
      >
        {task.completed ? "☑" : "☐"}
      </button>

      <span
        className={`mt-2 h-3 w-3 rounded-full ring-4 ${PRIORITY_DOT_CLASSES[task.priority]} ${PRIORITY_RING_CLASSES[task.priority]}`}
        title={PRIORITY_LABEL[task.priority]}
      />

      <div className="flex-1">
        <h3
          className={`text-xl font-bold ${
            task.completed
              ? "line-through text-neutral-400"
              : "text-neutral-900 dark:text-white"
          }`}
        >
          {task.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-50 px-4 py-2 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            {formatDeadline(task.deadline)}
          </span>

          {task.time && (
            <span className="rounded-full bg-blue-50 px-4 py-2 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              {task.time}
            </span>
          )}

          <span className="rounded-full bg-blue-50 px-4 py-2 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            {remaining}
          </span>
        </div>

        {task.deadline && (
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
             Add to Google Calendar
          </a>
        )}

        {overdue && (
          <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
            <h3 className="font-semibold text-red-600">
              Overdue Task
            </h3>

            <p className="mt-2 text-sm text-red-500">
              Suggested Action
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
className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-semibold text-white transition hover:scale-105"
              >
                Tomorrow
              </button>

              <button
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);

                  onReschedule(task.id, nextWeek.toISOString());
                }}
                className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-2 font-semibold text-white transition hover:scale-105"
              >
                Next Week
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
       className="rounded-full p-3 text-neutral-400 transition hover:scale-110 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}