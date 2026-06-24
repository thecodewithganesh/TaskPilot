import { useCallback, useState } from "react";
import { useGeminiExtraction } from "./usegeminiExtraction";
import type { Task, CaptureStatus } from "../types/task.types";

export interface UseTaskCaptureResult {
  tasks: Task[];
  status: CaptureStatus;
  error: string | null;
  lastInput: string;
  captureTask: (rawInput: string) => Promise<void>;
  retryLastCapture: () => Promise<void>;
  clearTasks: () => void;
}

export function useTaskCapture(): UseTaskCaptureResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastInput, setLastInput] = useState<string>("");

  const { status, error, extractTasks } = useGeminiExtraction();

  const captureTask = useCallback(
    async (rawInput: string): Promise<void> => {
      const trimmedInput = rawInput.trim();

      if (!trimmedInput) {
        return;
      }

      setLastInput(trimmedInput);

      const result = await extractTasks(trimmedInput);

      if (!result || result.tasks.length === 0) {
        return;
      }

      setTasks((previousTasks) => [
        ...previousTasks,
        ...result.tasks,
      ]);
    },
    [extractTasks]
  );

  const retryLastCapture = useCallback(async (): Promise<void> => {
    if (!lastInput.trim()) {
      return;
    }

    const result = await extractTasks(lastInput);

    if (!result || result.tasks.length === 0) {
      return;
    }

    // Prevent duplicate tasks on retry
    setTasks((previousTasks) => {
      const existingKeys = new Set(
        previousTasks.map(
          (task) => `${task.title}-${task.deadline}`
        )
      );

      const newTasks = result.tasks.filter(
        (task) =>
          !existingKeys.has(`${task.title}-${task.deadline}`)
      );

      return [...previousTasks, ...newTasks];
    });
  }, [lastInput, extractTasks]);

  const clearTasks = useCallback((): void => {
    setTasks([]);
    setLastInput("");
  }, []);

  return {
    tasks,
    status,
    error,
    lastInput,
    captureTask,
    retryLastCapture,
    clearTasks,
  };
}