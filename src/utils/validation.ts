import { v4 as uuidv4 } from "uuid";
import type {
  ExtractionResult,
  Priority,
  Task,
} from "../types/task.types";
import type { GeminiExtractionResponse } from "../types/gemini.types";

function clampConfidence(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function validatePriority(value: unknown): Priority {
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }

  return "medium";
}

function validateDeadline(deadline: unknown): string | null {
  if (typeof deadline !== "string") {
    return null;
  }

  const parsed = new Date(deadline);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toISOString().split("T")[0];
}

function estimateEffort(title: string): string {
  const text = title.toLowerCase();

  if (
    text.includes("call") ||
    text.includes("appointment") ||
    text.includes("meeting")
  ) {
    return "30 min";
  }

  if (
    text.includes("assignment") ||
    text.includes("homework") ||
    text.includes("report")
  ) {
    return "2 hrs";
  }

  if (
    text.includes("interview")
  ) {
    return "1 hr";
  }

  if (
    text.includes("prepare") ||
    text.includes("study") ||
    text.includes("exam")
  ) {
    return "Half day";
  }

  if (
    text.includes("project")
  ) {
    return "Full day";
  }

  return "1 hr";
}

export function validateExtractionResponse(
  response: GeminiExtractionResponse,
  rawInput: string,
): ExtractionResult {
  const tasks: Task[] = response.tasks
    .filter(
      (task) =>
        typeof task.title === "string" &&
        task.title.trim()
    )
    .map((task) => ({
      id: uuidv4(),
      title: task.title.trim(),
      deadline: validateDeadline(task.deadline),
      time: typeof task.time === "string" ? task.time : null,
      priority: validatePriority(task.priority),

      // Use Gemini's effort if provided, otherwise estimate ourselves
      estimatedEffort:
        typeof task.estimatedEffort === "string" &&
        task.estimatedEffort.trim()
          ? task.estimatedEffort
          : estimateEffort(task.title),

      confidence: clampConfidence(task.confidence),
      createdAt: new Date().toISOString(),
      rawInput,
    }));

  return { tasks };
}