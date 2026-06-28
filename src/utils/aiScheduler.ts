import type { Task } from "../types/task.types";

export function getNextBestTask(tasks: Task[]): Task | null {
  const activeTasks = tasks.filter(
    (task) => !task.completed && task.deadline
  );

  if (activeTasks.length === 0) return null;

  return activeTasks.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Priority score
    if (a.priority === "high") scoreA += 30;
    if (a.priority === "medium") scoreA += 20;
    if (a.priority === "low") scoreA += 10;

    if (b.priority === "high") scoreB += 30;
    if (b.priority === "medium") scoreB += 20;
    if (b.priority === "low") scoreB += 10;

    // Deadline score
    scoreA -= new Date(a.deadline!).getTime();
    scoreB -= new Date(b.deadline!).getTime();

    return scoreB - scoreA;
  })[0];
}