import type { Task } from "../types/task.types";

export function isTaskOverdue(task: Task) {
  if (!task.deadline || task.completed) return false;

  return new Date(task.deadline).getTime() < Date.now();
}

export function getSuggestedReschedule() {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString();
}