import type { Task } from "../../types/task.types";
import { useTaskCountdown } from "../../hooks/useTaskCountdown";

interface DailyPlannerProps {
  tasks: Task[];
}

function DailyPlannerRow({ task }: { task: Task }) {
  const remaining = useTaskCountdown(task);

  return (
    <div className="rounded-xl bg-white p-4 shadow dark:bg-neutral-800">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{task.title}</h3>

      {task.time && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Time: {task.time}</p>
      )}

      {/* Live countdown (shared with TaskCard/AISchedule via
          useTaskCountdown) replaces the previously static
          estimatedEffort display here, per explicit request. */}
      <p className="text-sm text-green-600">{remaining}</p>
    </div>
  );
}

export function DailyPlanner({ tasks }: DailyPlannerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasks
    .filter((task) => {
      if (task.completed || !task.deadline) return false;

      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);

      return deadline.getTime() === today.getTime();
    })
    .sort((a, b) => {
      const timeA = a.time ?? "23:59";
      const timeB = b.time ?? "23:59";
      return timeA.localeCompare(timeB);
    });

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="mb-5 text-xl font-bold text-neutral-900 dark:text-white">Today's Plan</h2>

      {todaysTasks.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">Nothing scheduled for today.</p>
      ) : (
        <div className="space-y-3">
          {todaysTasks.map((task) => (
            <DailyPlannerRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}