export interface ConfidenceIndicatorProps {
  confidence: number;
}

function getBarColorClass(confidence: number): string {
  if (confidence > 0.85) {
    return "bg-green-500";
  }
  if (confidence >= 0.6) {
    return "bg-amber-500";
  }
  return "bg-red-500";
}

export function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const clamped = Math.min(1, Math.max(0, confidence));
  const percentage = Math.round(clamped * 100);
  const barColorClass = getBarColorClass(clamped);

  return (
    <div className="flex w-full max-w-[140px] flex-col gap-1">
      <span className="text-xs font-medium text-neutral-500">
        {percentage}% confident
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
