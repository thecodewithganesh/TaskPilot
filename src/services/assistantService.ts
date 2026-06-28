import { GoogleGenAI } from "@google/genai";
import type { Task } from "../types/task.types";
import type { AssistantAction } from "../types/assistantAction.types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function askAssistant(
  prompt: string,
  tasks: Task[],
): Promise<AssistantAction> {
  try {
    const taskContext = tasks
      .map(
        (task, index) => `
${index + 1}.
Title: ${task.title}
Completed: ${task.completed}
Priority: ${task.priority}
Deadline: ${task.deadline ?? "None"}
Time: ${task.time ?? "None"}
`,
      )
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: `
You are TaskPilot AI.

Current Tasks:

${taskContext}

The user may ask to:

- delete a task
- complete a task
- reschedule a task
- change priority

Return ONLY valid JSON.

Examples:

{
  "action": "delete",
  "taskTitle": "Gym"
}

{
  "action": "complete",
  "taskTitle": "Shopping"
}

{
  "action": "priority",
  "taskTitle": "Math Assignment",
  "priority": "high"
}

{
  "action": "reschedule",
  "taskTitle": "Project",
  "newDate": "2026-07-01"
}

If the user is only asking a question return:

{
  "action": "none",
  "reply": "your answer"
}

User:

${prompt}
`,
    });

    return JSON.parse(response.text ?? "{}") as AssistantAction;
  } catch (error) {
    console.error(error);

    return {
      action: "none",
      reply: "Gemini is currently unavailable.",
    };
  }
}