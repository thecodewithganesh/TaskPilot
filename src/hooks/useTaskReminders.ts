import { useEffect } from "react";
import type { Task } from "../types/task.types";
import { showNotification } from "../utils/notifications";
import { getReminderMinutes } from "../utils/reminderPreference";

const notifiedTasks = new Set<string>();

export function useTaskReminders(tasks: Task[]) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      // Read fresh on every tick rather than once outside the
      // interval — so a user changing their reminder preference in
      // ReminderSettings takes effect on the very next check, not
      // only after a full page reload.
      const reminderMinutes = getReminderMinutes();
      const reminderWindowMs = reminderMinutes * 60 * 1000;

      tasks.forEach((task) => {
        if (task.completed || !task.deadline || notifiedTasks.has(task.id)) {
          return;
        }

        // FIX: previously only used task.deadline (a date-only string
        // like "2026-06-30"), which Date() resolves to midnight —
        // meaning every reminder fired relative to midnight rather
        // than the task's actual scheduled time. Tasks with a stated
        // time (e.g. "7:00 PM") now correctly count down to that exact
        // moment, matching the same construction useTaskCountdown
        // already uses elsewhere. Falls back to date-only (midnight)
        // only when no time was ever specified for the task.
        const deadline = task.time
          ? new Date(`${task.deadline} ${task.time}`)
          : new Date(task.deadline);

        if (Number.isNaN(deadline.getTime())) {
          return;
        }

        const difference = deadline.getTime() - now.getTime();

        // FIX: previously hardcoded to a fixed 30-minute window
        // regardless of the user's actual reminder preference set in
        // ReminderSettings. Now uses that same stored preference, so
        // "remind me 10 minutes before" genuinely fires at 10 minutes,
        // not always at 30.
        if (difference > 0 && difference <= reminderWindowMs) {
          showNotification("🔔 Task Reminder", `${task.title} is due soon.`);
          notifiedTasks.add(task.id);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);
}