import type { Priority } from "./task.types";

export interface GeminiTaskResponse {
  title: string;
  deadline: string | null;
  time: string | null;
  priority: Priority;
  estimatedEffort: string;
  confidence: number;
}

export interface GeminiExtractionResponse {
  tasks: GeminiTaskResponse[];
}