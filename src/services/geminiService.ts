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
      model: "gemini-2.0-flash",
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
                  title: { type: Type.STRING },
                  deadline: {
                    type: Type.STRING,
                    nullable: true,
                  },
                  time: {
                    type: Type.STRING,
                    nullable: true,
                  },
                  priority: {
                    type: Type.STRING,
                    enum: ["high", "medium", "low"],
                  },
                  estimatedEffort: {
                    type: Type.STRING,
                  },
                  confidence: {
                    type: Type.NUMBER,
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