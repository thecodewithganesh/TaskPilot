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
      model: "gemini-2.5-flash",

      contents: `
You are TaskPilot AI.

Current Tasks:

${taskContext}

You MUST understand the user's intention and return ONLY valid JSON.

Supported actions:

1. Delete a task

{
  "action":"delete",
  "taskTitle":"Gym"
}

2. Complete a task

{
  "action":"complete",
  "taskTitle":"Math Assignment"
}

3. Reschedule a task

{
  "action":"reschedule",
  "taskTitle":"Project",
  "newDate":"2026-07-01"
}

4. Change priority

{
  "action":"priority",
  "taskTitle":"Assignment",
  "priority":"high"
}

5. Show today's tasks

{
  "action":"today"
}

6. Show overdue tasks

{
  "action":"overdue"
}

7. Show completed tasks

{
  "action":"completed"
}

8. Show pending tasks

{
  "action":"pending"
}

9. Show high priority tasks

{
  "action":"highPriority"
}

10. If the user is chatting or asking something else

{
  "action":"none",
  "reply":"Your answer"
}

Never explain.

Never return markdown.

Return ONLY JSON.

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