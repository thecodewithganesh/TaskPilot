import { useEffect, useState } from "react";
import type { Task } from "../types/task.types";
import { getReminderMinutes } from "../utils/reminderPreference";

/**
 * Live "time remaining until deadline" countdown, shared by TaskCard,
 * AISchedule, and DailyPlanner so this calculation exists in exactly
 * one place. Previously each surface either reimplemented this
 * differently or showed the static estimatedEffort instead — pulling
 * it out here means a future fix only has to happen once.
 *
 * Falls back to the task's estimatedEffort string when there's no
 * deadline/time to count down to, since "time remaining" is undefined
 * for a task with no due date.s
 */
export function useTaskCountdown(task: Task): string {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function updateRemaining() {
      if (!task.deadline || !task.time) {
        setRemaining(task.estimatedEffort);
        return;
      }

      const target = new Date(`${task.deadline} ${task.time}`);
      const now = new Date();
      const reminder = getReminderMinutes();

      const diff = target.getTime() - now.getTime() - reminder * 60 * 1000;

      if (diff <= 0) {
        setRemaining("Starting now");
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setRemaining(hrs > 0 ? `${hrs} hr ${mins} min left` : `${mins} min left`);
    }

    updateRemaining();
    const interval = setInterval(updateRemaining, 60000);
    return () => clearInterval(interval);
  }, [task.deadline, task.time, task.estimatedEffort]);

  return remaining;
}