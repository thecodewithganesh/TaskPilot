import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTaskCapture } from "../hooks/useTaskCapture";
import { useShareTarget } from "../hooks/useShareTarget";
import { CaptureBar } from "../components/capture/Capturebar";
import { LoadingState } from "../components/feedback/LoadingState";
import { ErrorState } from "../components/feedback/ErrorState";
import { EmptyState } from "../components/feedback/EmptyState";
import { TaskList } from "../components/tasks/TaskList";
import { AppShell } from "../components/layout/Appshell";
import { DarkModeToggle } from "../components/layout/DarkModeToggle";
import { TaskStats } from "../components/tasks/TaskStats";
import { TaskCalendar } from "../components/Calender/TaskCalender";
import { UpcomingTasks } from "../components/tasks/UpcomingTasks";
import { NotificationSettings } from "../components/settings/NotificationSettings";
import { useTaskReminders } from "../hooks/useTaskReminders";
import { ReminderSettings } from "../components/settings/ReminderSettings";
import { SmartInsights } from "../components/insights/SmartInsights";
import { AISchedule } from "../components/scheduler/AISchedule";
import { DailyPlanner } from "../components/scheduler/DailyPlanner";
import { WorkloadSummary } from "../components/scheduler/WorkloadSummary";
import { SmartScheduler } from "../components/scheduler/SmartScheduler";
import { FloatingAIAssistant } from "../components/assistant/FloatingAIAssistant";
export function CapturePage() {
  const {
    tasks,
    status,
    error,
    captureTask,
    retryLastCapture,
    clearTasks,
    toggleTaskCompletion,
    deleteTask,
    rescheduleTask,
  } = useTaskCapture();

  useTaskReminders(tasks);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const sharedPayload = useShareTarget();

  useEffect(() => {
    if (!sharedPayload) return;
    const textToCapture = sharedPayload.text || sharedPayload.title;
    if (textToCapture && textToCapture.trim().length > 0) {
      void captureTask(textToCapture);
    }
  }, [sharedPayload, captureTask]);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) => task.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const calendarFilteredTasks = selectedDate
  ? filteredTasks.filter((task) => {
      if (!task.deadline) return false;

      return (
        new Date(task.deadline).toDateString() ===
        selectedDate.toDateString()
      );
    })
  : filteredTasks;

  function handleClearAll() {
    clearTasks();
  }

  return (
    <AppShell
      header={
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            TaskPilot
          </span>
          <DarkModeToggle />
        </div>
      }
    >
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          TaskPilot
        </h1>
        <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
          What do you need to remember?
        </p>
      </header>

      <section className="w-full">
        <CaptureBar status={status} captureTask={captureTask} />

        {tasks.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearAll}
              className="rounded-xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        )}
      </section>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <LoadingState key="loading" />
          ) : status === "error" ? (
            <ErrorState
              key="error"
              message={error ?? "Something went wrong."}
              onRetry={retryLastCapture}
            />
          ) : tasks.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <>
          <div className="mb-6">
        <TaskCalendar
          tasks={tasks}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <UpcomingTasks tasks={tasks} />
        <NotificationSettings />
        <ReminderSettings />
        <SmartInsights tasks={tasks} />
        <AISchedule tasks={tasks} />
        <DailyPlanner tasks={tasks} />
        <WorkloadSummary tasks={tasks} />
        <SmartScheduler tasks={tasks} />
      </div>

          <TaskStats tasks={tasks} />

          <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2 text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="mb-6 flex flex-wrap gap-3">
  <button
    onClick={() => setFilter("all")}
    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
      filter === "all"
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    }`}
  >
    📋 All ({tasks.length})
  </button>

  <button
    onClick={() => setFilter("active")}
    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
      filter === "active"
        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    }`}
  >
    ⏳ Active ({tasks.filter(t => !t.completed).length})
  </button>

  <button
    onClick={() => setFilter("completed")}
    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
      filter === "completed"
        ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    }`}
  >
    ✅ Completed ({tasks.filter(t => t.completed).length})
  </button>
</div>

              <TaskList
                key="tasks"
                tasks={calendarFilteredTasks}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
                onReschedule={rescheduleTask}
              />
            </>
          )}
        </AnimatePresence>
      </div>
      <FloatingAIAssistant
  tasks={tasks}
  onDelete={deleteTask}
  onToggleComplete={toggleTaskCompletion}
/>
    </AppShell>
  );
}