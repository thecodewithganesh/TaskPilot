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
    <div className="mb-6 rounded-3xl border border-violet-500 bg-violet-50 p-6 dark:bg-violet-900/20">
      <h2 className="mb-4 text-xl font-bold text-violet-700 dark:text-violet-300">
        📊 AI Workload Summary
      </h2>

      <div className="space-y-2 text-sm">
        <p>🔥 High Priority: <strong>{high}</strong></p>
        <p>⚡ Medium Priority: <strong>{medium}</strong></p>
        <p>🌿 Low Priority: <strong>{low}</strong></p>

        <hr className="my-3" />

        <p className="font-semibold">
          Total Active Tasks: {activeTasks.length}
        </p>

        <p className="text-violet-600 dark:text-violet-300">
          💡 Focus on high-priority tasks first.
        </p>
      </div>
    </div>
  );
}