import type { Task } from "../types/task.types";

/**
 * Parses a "5:00 PM" / "10:30 AM" style 12-hour time string into
 * { hours, minutes } in 24-hour form. Returns null if it can't be parsed.
 */
function parseTimeString(
  time: string | null | undefined,
): { hours: number; minutes: number } | null {
  if (!time) return null;

  const match = time
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Builds a real local Date from a "YYYY-MM-DD" deadline plus an optional
 * "5:00 PM" time string. If no time is given, defaults to end of day
 * (23:59:59) so a same-day task isn't treated as overdue before it's even
 * had a chance to happen.
 *
 * FIX: previously `new Date(task.deadline)` was used directly, which
 * JS parses as midnight UTC for a date-only string. For anyone not in
 * UTC+0, "today" reads as already in the past almost immediately after
 * local midnight, regardless of the task's actual time. This also never
 * looked at task.time at all, so a 7 PM task and a 7 AM task were treated
 * identically.
 */
export function getTaskDeadlineDate(task: Task): Date | null {
  if (!task.deadline) return null;

  const [yearStr, monthStr, dayStr] = task.deadline.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (!year || !month || !day) return null;

  const parsedTime = parseTimeString(task.time);

  if (parsedTime) {
    // Construct in LOCAL time, not UTC, using the actual task time.
    return new Date(
      year,
      month - 1,
      day,
      parsedTime.hours,
      parsedTime.minutes,
      0,
      0,
    );
  }

  // No time specified — treat the deadline as due by end of that day,
  // not at local midnight.
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.deadline || task.completed) return false;

  const deadlineDate = getTaskDeadlineDate(task);
  if (!deadlineDate) return false;

  return deadlineDate.getTime() < Date.now();
}

export function getSuggestedReschedule() {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString();
}