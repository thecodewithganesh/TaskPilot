import { useEffect } from "react";
import type { Task } from "../types/task.types";
import { showNotification } from "../utils/notifications";

const notifiedTasks = new Set<string>();

export function useTaskReminders(tasks: Task[]) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (
          task.completed ||
          !task.deadline ||
          notifiedTasks.has(task.id)
        ) {
          return;
        }

        const deadline = new Date(task.deadline);

        const difference =
          deadline.getTime() - now.getTime();

        // Notify within 30 minutes before deadline
        if (difference > 0 && difference <= 30 * 60 * 1000) {
          showNotification(
            "🔔 Task Reminder",
            `${task.title} is due soon.`
          );

          notifiedTasks.add(task.id);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);
}