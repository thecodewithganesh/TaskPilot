export function formatDate(date: string | null): string {
  if (!date) {
    return "No date set";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "No date set";
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}