import type { Task } from "../types/task.types";

export function searchTasks(query: string, tasks: Task[]): Task[] {
  const search = query.toLowerCase();

  return tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(search) ||
      (task.deadline?.toLowerCase().includes(search) ?? false) ||
      task.priority.toLowerCase().includes(search)
    );
  });
}