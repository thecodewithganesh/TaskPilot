export type Priority = "high" | "medium" | "low";

export type CaptureStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface Task {
  id: string;
  title: string;
  deadline: string | null;
  time: string | null;
  priority: Priority;
  estimatedEffort: string;
  confidence: number;
  createdAt: string;
  rawInput: string;
}

export interface ExtractionResult {
  tasks: Task[];
}