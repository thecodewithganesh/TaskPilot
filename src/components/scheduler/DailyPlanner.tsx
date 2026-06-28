import type { Task } from "../../types/task.types";

interface DailyPlannerProps {
  tasks: Task[];
}

export function DailyPlanner({ tasks }: DailyPlannerProps) {
  const today = new Date().toDateString();

  const todaysTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.deadline &&
      new Date(task.deadline).toDateString() === today
  );

  return (
    <div className="mb-6 rounded-3xl border border-green-600 bg-green-50 p-6 dark:bg-green-900/20">
      <h2 className="mb-5 text-xl font-bold text-green-700 dark:text-green-300">
        📅 Today's AI Plan
      </h2>

      {todaysTasks.length === 0 ? (
        <p className="text-neutral-500">
          Nothing scheduled for today.
        </p>
      ) : (
        <div className="space-y-3">
          {todaysTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl bg-white p-4 shadow dark:bg-neutral-800"
            >
              <h3 className="font-semibold">
                {task.title}
              </h3>

              {task.time && (
                <p className="text-sm text-neutral-500">
                  🕒 {task.time}
                </p>
              )}

              <p className="text-sm text-green-600">
                Estimated: {task.estimatedEffort}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}