import { useCallback, useEffect, useState } from "react";
import { useGeminiExtraction } from "./usegeminiExtraction";
import type { Task, CaptureStatus } from "../types/task.types";
import { loadTasks, saveTasks, clearTasks as clearPersistedTasks } from "../utils/LocalStorage";

export interface UseTaskCaptureResult {
  tasks: Task[];
  status: CaptureStatus;
  error: string | null;
  lastInput: string;
  captureTask: (rawInput: string) => Promise<void>;
  retryLastCapture: () => Promise<void>;
  clearTasks: () => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  rescheduleTask: (id: string, newDate: string) => void;
  changeTaskPriority: (id: string, priority: "high" | "medium" | "low") => void;
}

export function useTaskCapture(): UseTaskCaptureResult {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [lastInput, setLastInput] = useState<string>("");
  const { status, error, extractTasks } = useGeminiExtraction();

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const captureTask = useCallback(
    async (rawInput: string): Promise<void> => {
      const trimmedInput = rawInput.trim();
      if (!trimmedInput) return;

      setLastInput(trimmedInput);
      const result = await extractTasks(trimmedInput);
      if (!result || result.tasks.length === 0) return;

      setTasks((previousTasks) => [...previousTasks, ...result.tasks]);
    },
    [extractTasks],
  );

  const retryLastCapture = useCallback(async (): Promise<void> => {
    if (!lastInput.trim()) return;

    const result = await extractTasks(lastInput);
    if (!result || result.tasks.length === 0) return;

    setTasks((previousTasks) => {
      const existingKeys = new Set(previousTasks.map((task) => `${task.title}-${task.deadline}`));
      const newTasks = result.tasks.filter((task) => !existingKeys.has(`${task.title}-${task.deadline}`));
      return [...previousTasks, ...newTasks];
    });
  }, [lastInput, extractTasks]);

  const clearTasks = useCallback((): void => {
    setTasks([]);
    setLastInput("");
    clearPersistedTasks();
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }, []);

  const deleteTask = useCallback((id: string): void => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
  }, []);

  const rescheduleTask = useCallback((id: string, newDate: string): void => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === id ? { ...task, deadline: newDate } : task)),
    );
  }, []);

  const changeTaskPriority = useCallback(
    (id: string, priority: "high" | "medium" | "low"): void => {
      setTasks((previousTasks) =>
        previousTasks.map((task) => (task.id === id ? { ...task, priority } : task)),
      );
    },
    [],
  );

  return {
    tasks,
    status,
    error,
    lastInput,
    captureTask,
    retryLastCapture,
    clearTasks,
    toggleTaskCompletion,
    deleteTask,
    rescheduleTask,
    changeTaskPriority,
  };
}