import type { Task } from "../types/task.types";

export function getTaskAnalytics(tasks: Task[]) {
  const now = new Date();

  const pending = tasks.filter((t) => !t.completed);

  const completed = tasks.filter((t) => t.completed);

  const overdue = pending.filter(
    (t) => t.deadline && new Date(t.deadline).getTime() < now.getTime()
  );

  const today = pending.filter((t) => {
    if (!t.deadline) return false;

    return (
      new Date(t.deadline).toDateString() === now.toDateString()
    );
  });

  const highPriority = pending.filter(
    (t) => t.priority === "high"
  );

  return {
    pending: pending.length,
    completed: completed.length,
    overdue: overdue.length,
    today: today.length,
    highPriority: highPriority.length,
  };
}