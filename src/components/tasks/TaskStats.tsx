import type { Task } from "../../types/task.types";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  return (
    <div className="mb-4 grid grid-cols-3 gap-3">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-2xl font-bold">{total}</p>
        <p className="text-sm text-neutral-500">Total</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-2xl font-bold text-green-500">
          {completed}
        </p>
        <p className="text-sm text-neutral-500">Completed</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-2xl font-bold text-amber-500">
          {pending}
        </p>
        <p className="text-sm text-neutral-500">Pending</p>
      </div>
    </div>
  );
}