import type { Priority } from "../../types/task.types";

export interface PriorityBadgeProps {
  priority: Priority;
}

const PRIORITY_BADGE_CLASSES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const PRIORITY_TEXT: Record<Priority, string> = {
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${PRIORITY_BADGE_CLASSES[priority]}`}
    >
      {PRIORITY_TEXT[priority]}
    </span>
  );
}