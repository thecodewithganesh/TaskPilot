export type AssistantAction =
  | {
      action: "delete";
      taskTitle: string;
    }
  | {
      action: "complete";
      taskTitle: string;
    }
  | {
      action: "reschedule";
      taskTitle: string;
      newDate: string;
    }
  | {
      action: "priority";
      taskTitle: string;
      priority: "high" | "medium" | "low";
    }
  | {
      action: "none";
      reply: string;
    };