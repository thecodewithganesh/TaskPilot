import { GoogleGenAI } from "@google/genai";
import type { Task } from "../types/task.types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generateAISchedule(tasks: Task[]) {
  const activeTasks = tasks.filter((task) => !task.completed);

  if (activeTasks.length === 0) {
    return "🎉 You have completed all your tasks!";
  }

  const prompt = `
You are an AI productivity coach.

These are my tasks:

${activeTasks
  .map(
    (task) => `
Title: ${task.title}
Priority: ${task.priority}
Deadline: ${task.deadline ?? "None"}
Estimated Effort: ${task.estimatedEffort}
`
  )
  .join("\n")}

Give me:

1. Which task I should do first.
2. Why.
3. Recommended order for the remaining tasks.

Keep the response under 120 words.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    return response.text ?? "No AI recommendation available.";
  } catch (error) {
    console.error("AI Scheduler Error:", error);
    return "Unable to generate an AI schedule right now.";
  }
}