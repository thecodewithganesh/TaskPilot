import type { Task } from "../../types/task.types";

interface WorkloadSummaryProps {
  tasks: Task[];
}

export function WorkloadSummary({ tasks }: WorkloadSummaryProps) {
  const activeTasks = tasks.filter((task) => !task.completed);

  const high = activeTasks.filter((t) => t.priority === "high").length;
  const medium = activeTasks.filter((t) => t.priority === "medium").length;
  const low = activeTasks.filter((t) => t.priority === "low").length;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="mb-4 text-xl font-bold text-violet-700 dark:text-violet-300">
         AI Workload Summary
      </h2>

      <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
  <p className="flex justify-between">
    <span>High Priority</span>
    <strong className="text-red-500">{high}</strong>
  </p>

  <p className="flex justify-between">
    <span>Medium Priority</span>
    <strong className="text-amber-500">{medium}</strong>
  </p>

  <p className="flex justify-between">
    <span>Low Priority</span>
    <strong className="text-green-500">{low}</strong>
  </p>

  <hr className="border-neutral-300 dark:border-neutral-700" />

  <p className="flex justify-between font-semibold text-neutral-900 dark:text-white">
    <span>Total Active Tasks</span>
    <span>{activeTasks.length}</span>
  </p>

  <div className="rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
    Focus on high-priority tasks first.
  </div>
  </div>
</div>
  );
}