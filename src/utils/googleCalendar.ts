import type { Task } from "../types/task.types";

export function createGoogleCalendarUrl(task: Task) {
  if (!task.deadline) return "";

  const start = new Date(task.deadline);

  // Default duration: 1 hour
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const formatDate = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d+/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: task.title,
    details: `Priority: ${task.priority}\nEstimated Effort: ${task.estimatedEffort}`,
    dates: `${formatDate(start)}/${formatDate(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}