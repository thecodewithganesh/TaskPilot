import { useState } from "react";
import { VoiceOrb } from "./VoiceOrb";
import { AssistantPanel } from "./AssistantPanel";
import type { Task } from "../../types/task.types";

interface FloatingAIAssistantProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onReschedule: (id: string, newDate: string) => void;
  onChangePriority: (id: string, priority: "high" | "medium" | "low") => void;
}

export function FloatingAIAssistant({
  tasks,
  onDelete,
  onToggleComplete,
  onReschedule,
  onChangePriority,
}: FloatingAIAssistantProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
   <div className="animate-in fade-in duration-500">
      <div className="relative">

  <VoiceOrb
    listening={open}
    onClick={() => setOpen(true)}
  />
  </div>
</div>

      <AssistantPanel
        open={open}
        onClose={() => setOpen(false)}
        tasks={tasks}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onReschedule={onReschedule}
        onChangePriority={onChangePriority}
      />
    </div>
  );
}