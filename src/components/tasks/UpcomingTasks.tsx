import type { Task } from "../../types/task.types";

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const upcomingTasks = tasks
  .filter((task) => !task.completed && task.deadline)
  .sort((a, b) => {
    const getDateTime = (task: Task) => {
      const date = task.deadline!;

      if (task.time) {
        return new Date(`${date} ${task.time}`).getTime();
      }

      return new Date(date).getTime();
    };

    return getDateTime(a) - getDateTime(b);
  })
  .slice(0, 5);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
        📌 Upcoming Tasks
      </h2>

      {upcomingTasks.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No upcoming tasks.
        </p>
      ) : (
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 p-3 dark:border-neutral-700"
            >
              <div>
                <p className="font-medium text-neutral-600 dark:text-neutral-300">
                  {task.title}
                </p>

                <p className="text-sm text-neutral-600 dark:text-neutral-300">
  {formatDate(task.deadline!)}
  {task.time && ` • ${task.time}`}
</p>
              </div>

              {task.time && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {task.time}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}