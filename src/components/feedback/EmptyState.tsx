import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <ClipboardList className="h-6 w-6 text-neutral-400" />

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-neutral-800">Nothing captured yet</h3>
        <p className="text-sm text-neutral-500">
          Try typing what&apos;s on your mind.
        </p>
      </div>
    </div>
  );
}