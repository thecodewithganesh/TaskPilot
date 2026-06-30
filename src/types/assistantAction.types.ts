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
      action: "today";
    }
  | {
      action: "pending";
    }
  | {
      action: "completed";
    }
  | {
      action: "overdue";
    }
  | {
      action: "highPriority";
    }
  | {
      action: "none";
      reply: string;
    };