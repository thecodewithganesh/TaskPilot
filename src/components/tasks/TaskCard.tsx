import type { Task, Priority } from "../../types/task.types";

export interface TaskCardProps {
  task: Task;
}

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-green-500",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

function formatDeadline(deadline: string | null): string {
  if (!deadline) {
    return "No date set";
  }

  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return "No date set";
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <span
        aria-label={PRIORITY_LABEL[task.priority]}
        title={PRIORITY_LABEL[task.priority]}
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${PRIORITY_DOT_CLASSES[task.priority]}`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="truncate text-base font-medium text-neutral-900 sm:text-lg">
          {task.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <span
            className={
              task.deadline
                ? "rounded-full bg-neutral-100 px-2.5 py-0.5 text-neutral-700"
                : "rounded-full bg-neutral-50 px-2.5 py-0.5 text-neutral-400"
            }
          >
            {formatDeadline(task.deadline)}
          </span>

          {task.time && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-neutral-700">
              {task.time}
            </span>
          )}

          <span className="text-neutral-400">{task.estimatedEffort}</span>
        </div>
      </div>
    </div>
  );
}
