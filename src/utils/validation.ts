import { v4 as uuidv4 } from "uuid";
import type {
  ExtractionResult,
  Priority,
  Task,
} from "../types/task.types";
import type { GeminiExtractionResponse } from "../types/gemini.types";

function clampConfidence(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function validatePriority(value: unknown): Priority {
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }

  return "medium";
}

function validateDeadline(deadline: unknown): string | null {
  if (typeof deadline !== "string") {
    return null;
  }

  const parsed = new Date(deadline);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toISOString().split("T")[0];
}

/**
 * Deterministically estimates effort from the task title/text, keyword by
 * keyword, ordered from most specific/high-signal phrases to more generic
 * ones (checked top-to-bottom, first match wins).
 *
 * Coverage is intentionally broad so the generic fallback at the bottom
 * only catches genuinely ambiguous titles — e.g. "Delivery" and "Taking
 * shower" previously both fell through to the same fallback value despite
 * being very different in scope. They now have their own buckets below.
 */
export function estimateEffort(title: string): string {
  const text = title.toLowerCase();

  // --- Very quick personal/hygiene actions: a few minutes ---
  if (
    text.includes("shower") ||
    text.includes("brush") ||
    text.includes("skincare") ||
    text.includes("get dressed") ||
    text.includes("make bed") ||
    text.includes("take medicine") ||
    text.includes("take meds") ||
    text.includes("vitamins")
  ) {
    return "10 min";
  }

  // --- Quick communications / single short actions ---
  if (
    text.includes("call") ||
    text.includes("text") ||
    text.includes("email") ||
    text.includes("reply") ||
    text.includes("message") ||
    text.includes("ping") ||
    text.includes("confirm") ||
    text.includes("rsvp") ||
    text.includes("pay bill") ||
    text.includes("pay rent") ||
    text.includes("water the") ||
    text.includes("feed the") ||
    text.includes("walk the dog") ||
    text.includes("take out trash") ||
    text.includes("take out the trash")
  ) {
    return "15 min";
  }

  // --- Pickups / drop-offs / deliveries / small errands ---
  if (
    text.includes("pick up") ||
    text.includes("pickup") ||
    text.includes("drop off") ||
    text.includes("dropoff") ||
    text.includes("delivery") ||
    text.includes("deliver") ||
    text.includes("courier") ||
    text.includes("buy") ||
    text.includes("order") ||
    text.includes("return ") ||
    text.includes("mail ")
  ) {
    return "30 min";
  }

  // --- Errands / chores / routine appointments ---
  if (
    text.includes("grocery") ||
    text.includes("groceries") ||
    text.includes("laundry") ||
    text.includes("dry cleaning") ||
    text.includes("clean") ||
    text.includes("tidy") ||
    text.includes("organize") ||
    text.includes("errand") ||
    text.includes("appointment") ||
    text.includes("checkup") ||
    text.includes("check-up") ||
    text.includes("dentist") ||
    text.includes("doctor") ||
    text.includes("haircut") ||
    text.includes("salon") ||
    text.includes("car wash") ||
    text.includes("oil change")
  ) {
    return "45 min";
  }

  // --- Meetings / calls with other people ---
  if (
    text.includes("meeting") ||
    text.includes("standup") ||
    text.includes("stand-up") ||
    text.includes("sync") ||
    text.includes("interview") ||
    text.includes("call with") ||
    text.includes("1:1") ||
    text.includes("one on one") ||
    text.includes("demo") ||
    text.includes("webinar") ||
    text.includes("zoom") ||
    text.includes("catch up with") ||
    text.includes("lunch with") ||
    text.includes("dinner with")
  ) {
    return "1 hr";
  }

  // --- Substantial focused work: assignments, reports, code, content ---
  if (
    text.includes("assignment") ||
    text.includes("homework") ||
    text.includes("report") ||
    text.includes("essay") ||
    text.includes("write") ||
    text.includes("draft") ||
    text.includes("edit") ||
    text.includes("proofread") ||
    text.includes("code") ||
    text.includes("debug") ||
    text.includes("fix bug") ||
    text.includes("review pr") ||
    text.includes("pull request") ||
    text.includes("presentation") ||
    text.includes("slides") ||
    text.includes("budget") ||
    text.includes("invoice") ||
    text.includes("submission") ||
    text.includes("submit")
  ) {
    return "2 hrs";
  }

  // --- Cooking / meal prep / workouts: own mid-size category ---
  if (
    text.includes("cook") ||
    text.includes("bake") ||
    text.includes("meal prep") ||
    text.includes("workout") ||
    text.includes("gym") ||
    text.includes("run") ||
    text.includes("yoga") ||
    text.includes("exercise")
  ) {
    return "1 hr";
  }

  // --- Prep / studying for something specific ---
  if (
    text.includes("prepare for") ||
    text.includes("prep for") ||
    text.includes("study for") ||
    text.includes("research") ||
    text.includes("read ") ||
    text.includes("watch course") ||
    text.includes("tutorial")
  ) {
    return "3 hrs";
  }

  // --- Big, open-ended, or multi-subject undertakings ---
  if (
    text.includes("exam") ||
    text.includes("finals") ||
    text.includes("midterm") ||
    text.includes("thesis") ||
    text.includes("dissertation") ||
    text.includes("certification") ||
    text.includes("interview prep")
  ) {
    return "Half day";
  }

  // --- Large projects / major planning / multi-day efforts ---
  if (
    text.includes("project") ||
    text.includes("plan the") ||
    text.includes("planning") ||
    text.includes("launch") ||
    text.includes("migration") ||
    text.includes("redesign") ||
    text.includes("offsite") ||
    text.includes("move house") ||
    text.includes("moving") ||
    text.includes("renovation") ||
    text.includes("wedding") ||
    text.includes("trip") ||
    text.includes("vacation")
  ) {
    return "Full day";
  }

  // --- Reminders / light hobbies / passive activities ---
  if (
    text.includes("remind") ||
    text.includes("reminder") ||
    text.includes("check in") ||
    text.includes("watch") ||
    text.includes("relax") ||
    text.includes("nap") ||
    text.includes("rest")
  ) {
    return "20 min";
  }

  // Fallback for anything genuinely unmatched.
  return "30 min";
}

export function validateExtractionResponse(
  response: GeminiExtractionResponse,
  rawInput: string,
): ExtractionResult {
  const tasks: Task[] = response.tasks
    .filter(
      (task) =>
        typeof task.title === "string" &&
        task.title.trim()
    )
    .map((task) => {
      const title = task.title.trim();

      return {
        id: uuidv4(),
        title,
        deadline: validateDeadline(task.deadline),
        time: typeof task.time === "string" ? task.time : null,
        priority: validatePriority(task.priority),
        completed: false,
        estimatedEffort:
  typeof task.estimatedEffort === "string" &&
  task.estimatedEffort.trim().length > 0
    ? task.estimatedEffort
    : estimateEffort(title),
        confidence: clampConfidence(task.confidence),
        createdAt: new Date().toISOString(),
        rawInput,
      };
    });

  return { tasks };
}