const SKELETON_CARD_COUNT = 3;

function SkeletonCard() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mt-1.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-neutral-200" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-neutral-200" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-3 w-12 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex w-full flex-col gap-3">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}