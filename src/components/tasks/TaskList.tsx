import type { Task } from "../../types/task.types";
import { TaskCard } from "./TaskCard";

export interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}