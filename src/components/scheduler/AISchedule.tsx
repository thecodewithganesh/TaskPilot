import type { Task } from "../../types/task.types";
import { getNextBestTask } from "../../utils/aiScheduler";
import { useEffect, useState } from "react";
import { generateAISchedule } from "../../services/aiSchedulerService";

interface AIScheduleProps {
  tasks: Task[];
}

export function AISchedule({ tasks }: AIScheduleProps) {
  const nextTask = getNextBestTask(tasks);

  const upcomingTasks = [...tasks]
    .filter((task) => !task.completed && task.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() -
        new Date(b.deadline!).getTime()
    )
    .slice(0, 5);

    const [aiPlan, setAiPlan] = useState("Thinking...");
    useEffect(() => {
  async function loadPlan() {
    try {
      const response = await generateAISchedule(tasks);
      setAiPlan(response);
    } catch (error) {
      console.error(error);
      setAiPlan("Unable to generate an AI schedule right now.");
    }
  }

  loadPlan();
}, [tasks]);

  return (
    <div className="mb-6 rounded-3xl border border-neutral-700 bg-neutral-800 p-6 shadow-lg">
      <h2 className="mb-5 text-xl font-bold text-white">
        🤖 AI Schedule
      </h2>

      {upcomingTasks.length === 0 ? (
        <p className="text-neutral-400">
          No upcoming tasks.
        </p>
      ) : (
        <>
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
  <h2 className="text-xl font-bold">
    🤖 Gemini AI Schedule
  </h2>

  <p className="mt-4 whitespace-pre-line leading-7">
    {aiPlan}
  </p>
</div>
          {nextTask && (
            <div className="mb-5 rounded-2xl bg-blue-600 p-5 text-white">
              <h3 className="text-lg font-bold">
                ⭐ AI Recommendation
              </h3>

              <p className="mt-2">
                You should work on <strong>{nextTask.title}</strong> first.
              </p>

              <p className="mt-1 text-blue-100">
                It has the highest priority and the nearest deadline.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl bg-neutral-900 p-4"
              >
                <h3 className="font-semibold text-white">
                  {task.title}
                </h3>

                <p className="text-sm text-neutral-400">
                  📅 {task.deadline}
                </p>

                {task.time && (
                  <p className="text-sm text-neutral-400">
                    🕒 {task.time}
                  </p>
                )}

                <p className="mt-2 rounded-xl bg-green-500/10 p-2 text-sm text-green-400">
                  {task.priority === "high"
                    ? "🔥 High priority. Finish this as soon as possible."
                    : task.priority === "medium"
                    ? "⚡ Medium priority. Plan to complete it today."
                    : "🌿 Low priority. Complete it when you have free time."}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}