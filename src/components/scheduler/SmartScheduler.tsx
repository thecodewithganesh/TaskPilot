import { Clock3 } from "lucide-react";
import { generateSchedule } from "../../utils/smartScheduler";
import type { Task } from "../../types/task.types";

interface SmartSchedulerProps {
  tasks: Task[];
}

export function SmartScheduler({ tasks }: SmartSchedulerProps) {
  const schedule = generateSchedule(tasks);

  function getReason(task: Task) {
  const reasons = [];

  if (task.priority === "high")
    reasons.push("🔥 High Priority");

  if (task.priority === "medium")
    reasons.push("⚡ Medium Priority");

  if (task.priority === "low")
    reasons.push("🌿 Low Priority");

  if (task.deadline)
    reasons.push("📅 Has Deadline");

  reasons.push(`⏳ ${task.estimatedEffort}`);

  return reasons;
}

  return (
    <div className="mb-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
        🧠 Today's Smart Schedule
      </h2>

      {schedule.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          No tasks available.
        </p>
      ) : (
        <div className="space-y-5">
          {schedule.map(({ task, suggestedTime }) => (
            <div
              key={task.id}
              className="flex items-start gap-4 rounded-2xl border border-neutral-200 p-4 transition hover:shadow-md dark:border-neutral-700"
            >
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <Clock3 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {suggestedTime}
                </p>

                <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
                  {task.title}
                </h3>

                {task.deadline && (
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    📅 Due: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-4 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
  <p className="mb-2 font-semibold text-neutral-900 dark:text-white">
    🧠 AI Reason
  </p>

  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
    {getReason(task).map((reason) => (
      <li key={reason}>{reason}</li>
    ))}
  </ul>

  <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
    💡 Recommended to complete before lower-priority tasks.
  </p>
</div>

                <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  {task.priority.toUpperCase()} PRIORITY
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}