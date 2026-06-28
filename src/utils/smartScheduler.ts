import type { Task } from "../types/task.types";

export interface ScheduledTask {
  task: Task;
  suggestedTime: string;
}

export function generateSchedule(tasks: Task[]): ScheduledTask[] {
  const activeTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const priorityWeight = {
        high: 3,
        medium: 2,
        low: 1,
      };

      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }

      if (!a.deadline) return 1;
      if (!b.deadline) return -1;

      return (
        new Date(a.deadline).getTime() -
        new Date(b.deadline).getTime()
      );
    });

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "07:00 PM",
  ];

  return activeTasks.map((task, index) => ({
    task,
    suggestedTime:
      timeSlots[index] ?? `After ${timeSlots[timeSlots.length - 1]}`,
  }));
}