import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiExtractionResponse } from "../types/gemini.types";
import { buildExtractionSystemPrompt } from "./promptTemplates";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export class GeminiExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiExtractionError";
  }
}

export async function extractTasksFromText(
  userInput: string,
): Promise<GeminiExtractionResponse> {
  if (!userInput.trim()) {
    throw new GeminiExtractionError("Input cannot be empty.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction: buildExtractionSystemPrompt(
          new Date().toISOString(),
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        ),

        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Short, clear title for the task.",
                  },
                  deadline: {
                    type: Type.STRING,
                    nullable: true,
                    description:
                      "Deadline in YYYY-MM-DD format, resolved from the current datetime, or null if no deadline is implied.",
                  },
                  time: {
                    type: Type.STRING,
                    nullable: true,
                    description:
                      'Specific time in "5:00 PM" format, or null if no time is implied.',
                  },
                  priority: {
                    type: Type.STRING,
                    enum: ["high", "medium", "low"],
                    description:
                      "high = urgent/exams/interviews/meetings/deadlines within 24h. medium = assignments/appointments due within a week. low = reminders/hobbies/long-term tasks.",
                  },
                  // FIX: this is the actual root cause of every task showing
                  // "1 hr". Under responseSchema-constrained decoding, Gemini
                  // weighs the schema's field-level `description` far more
                  // heavily than prose rules sitting in systemInstruction —
                  // a bare `type: Type.STRING` gives the model nothing to
                  // anchor to, so it collapses to the single most common
                  // token sequence. Restating the estimation guidance right
                  // here, plus concrete varied examples, is what actually
                  // changes behavior in structured-output mode.
                  estimatedEffort: {
                    type: Type.STRING,
                    description:
                      'Estimate the actual time required to COMPLETE the task. Return ONLY one value like: "10 mins", "20 mins", "30 mins", "45 mins", "1 hr", "1.5 hrs", "2 hrs", "3 hrs", "4 hrs", "5 hrs", "Half day", "Full day", or "2-3 days". Base the estimate on the task itself and NEVER default to the same value for every task.',
                  },
                  confidence: {
                    type: Type.NUMBER,
                    description:
                      "Confidence in this extraction, a number between 0 and 1.",
                  },
                },
                required: [
  "title",
  "deadline",
  "time",
  "priority",
  "estimatedEffort",
  "confidence",
],
              },
            },
          },
          required: ["tasks"],
        },
      },
    });

    if (!response.text) {
      throw new GeminiExtractionError("Empty response from Gemini.");
    }

    return JSON.parse(response.text) as GeminiExtractionResponse;
  } catch (error: any) {
    console.error("Gemini Error:", error);

    if (error instanceof GeminiExtractionError) {
      throw error;
    }

    throw new GeminiExtractionError(
      error?.message || "Failed to extract tasks from Gemini."
    );
  }
}