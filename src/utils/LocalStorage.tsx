// localStorage.ts
import type { Task } from "../types/task.types";

const STORAGE_KEY = "taskpilot-tasks";

export function saveTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStructurallyValidTask);
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    return [];
  }
}

export function clearTasks(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear tasks from localStorage:", error);
  }
}

function isStructurallyValidTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    (typeof candidate.deadline === "string" || candidate.deadline === null) &&
    (typeof candidate.time === "string" || candidate.time === null) &&
    typeof candidate.priority === "string" &&
    typeof candidate.estimatedEffort === "string" &&
    typeof candidate.confidence === "number" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.rawInput === "string"
  );
}