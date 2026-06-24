import { useCallback, useState } from "react";
import type {
  CaptureStatus,
  ExtractionResult,
} from "../types/task.types";
import {
  extractTasksFromText,
  GeminiExtractionError,
} from "../services/geminiService";
import { validateExtractionResponse } from "../utils/validation";

export interface UseGeminiExtractionResult {
  status: CaptureStatus;
  error: string | null;
  extractTasks: (rawInput: string) => Promise<ExtractionResult | null>;
}

export function useGeminiExtraction(): UseGeminiExtractionResult {
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const extractTasks = useCallback(
    async (rawInput: string): Promise<ExtractionResult | null> => {
      setStatus("loading");
      setError(null);

      try {
        const response = await extractTasksFromText(rawInput);

        const validatedResult = validateExtractionResponse(
          response,
          rawInput,
        );

        setStatus("success");

        return validatedResult;
      } catch (err) {
        setStatus("error");

        if (err instanceof GeminiExtractionError) {
          setError(err.message);
        } else {
          setError("Something went wrong.");
        }

        return null;
      }
    },
    [],
  );

  return {
    status,
    error,
    extractTasks,
  };
}