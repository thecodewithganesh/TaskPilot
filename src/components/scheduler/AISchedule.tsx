import { useEffect, useState } from "react";
import type { Task } from "../../types/task.types";
import { getNextBestTask } from "../../utils/aiScheduler";
import { generateAISchedule } from "../../services/aiSchedulerService";
import { useTaskCountdown } from "../../hooks/useTaskCountdown";

interface AIScheduleProps {
  tasks: Task[];
}

function UpcomingTaskRow({ task }: { task: Task }) {
  const remaining = useTaskCountdown(task);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition-colors dark:border-neutral-700 dark:bg-neutral-800">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{task.title}</h3>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {task.deadline
          ? new Date(task.deadline).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "No deadline"}
      </p>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {task.time ?? "No time set"}
      </p>

      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">⏳ {remaining}</p>

      <p className="mt-3 rounded-xl bg-green-500/10 p-2 text-sm text-green-600 dark:text-green-400">
        {task.priority === "high"
          ? "High priority. Finish this first."
          : task.priority === "medium"
          ? "Medium priority. Complete today."
          : "Low priority. Complete when free."}
      </p>
    </div>
  );
}

export function AISchedule({ tasks }: AIScheduleProps) {
  const [nextTask, setNextTask] = useState(() => getNextBestTask(tasks));
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
    const interval = setInterval(() => {
      setNextTask(getNextBestTask(tasks));
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const upcomingTasks = [...tasks]
    .filter((task) => !task.completed && task.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="mb-5 text-xl font-bold text-neutral-900 dark:text-white">AI Schedule</h2>

      <div className="mb-6 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-xl font-bold"> Gemini AI Schedule</h3>
        <p className="mt-4 whitespace-pre-line leading-7">{aiPlan}</p>
      </div>

      {nextTask && (
        <div className="mb-5 rounded-2xl bg-blue-600 p-5 text-white">
          <h3 className="text-lg font-bold">AI Recommendation</h3>
          <p className="mt-2">
            You should work on <strong>{nextTask.title}</strong> next.
          </p>
          <p className="mt-1 text-blue-100">
            Priority: {nextTask.priority} • Due{" "}
            {nextTask.deadline ? new Date(nextTask.deadline).toLocaleDateString() : "Anytime"}
          </p>
        </div>
      )}

      {upcomingTasks.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">No upcoming tasks.</p>
      ) : (
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <UpcomingTaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}