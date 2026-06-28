import { useState } from "react";
import { VoiceOrb } from "./VoiceOrb";
import { AssistantPanel } from "./AssistantPanel";
import type { Task } from "../../types/task.types";

interface FloatingAIAssistantProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function FloatingAIAssistant({
  tasks,
  onDelete,
  onToggleComplete,
}: FloatingAIAssistantProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceOrb
          listening={open}
          onClick={() => setOpen(true)}
        />
      </div>

      <AssistantPanel
        open={open}
        onClose={() => setOpen(false)}
        tasks={tasks}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
      />
    </>
  );
}