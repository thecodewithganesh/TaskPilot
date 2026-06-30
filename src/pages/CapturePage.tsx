import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { CalendarDays, X } from "lucide-react";
import { UpcomingTasks } from "../components/tasks/UpcomingTasks";
import { useTaskReminders } from "../hooks/useTaskReminders";
import { ReminderSettings } from "../components/settings/ReminderSettings";
import { SmartInsights } from "../components/insights/SmartInsights";
import { AISchedule } from "../components/scheduler/AISchedule";
import { DailyPlanner } from "../components/scheduler/DailyPlanner";
import { WorkloadSummary } from "../components/scheduler/WorkloadSummary";
import { FloatingAIAssistant } from "../components/assistant/FloatingAIAssistant";
import { useNotificationPermission } from "../hooks/useNotificationPermission";

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
    changeTaskPriority,
  } = useTaskCapture();

  useNotificationPermission();
  useTaskReminders(tasks);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

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

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = (() => {
  switch (filter) {
    case "active":
      return !task.completed;

    case "completed":
      return task.completed;

    case "all":
    default:
      return !task.completed;
  }
})();

    if (!matchesFilter) return false;

    if (searchQuery.trim().length === 0) return true;

    return task.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

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

          <div className="flex items-center gap-3">
           <button
  onClick={() => setShowCalendar(true)}
  className="rounded-xl border border-neutral-300 bg-white p-2 text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
>
  <CalendarDays size={20} />
</button>

            <DarkModeToggle />
          </div>
        </div>
      }
    >
  <header className="mb-3 text-center">
  <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
    TaskPilot
  </h1>
  <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300 sm:text-lg">
    Your AI task assistant
  </p>
</header>

      <section
className="
w-full
rounded-3xl
bg-white/70
p-5
shadow-xl
backdrop-blur-xl
dark:bg-neutral-900/70
"
>
        <CaptureBar status={status} captureTask={captureTask} />

        {tasks.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
onClick={handleClearAll}
className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
>
              Clear All
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {showCalendar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendar(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
             className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:bg-neutral-900/90"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Calendar
                </span>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="rounded-full p-3 text-neutral-400 transition hover:scale-110 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                >
                  <X size={18} />
                </button>
              </div>

              <TaskCalendar
                tasks={tasks}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              <div className="mb-8 space-y-6">
                <UpcomingTasks tasks={tasks} />
                <ReminderSettings />
                <SmartInsights tasks={tasks} />
                <AISchedule tasks={tasks} />
                <DailyPlanner tasks={tasks} />
                <WorkloadSummary tasks={tasks} />
              </div>

              <TaskStats tasks={tasks} />

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/30 bg-white/80 px-5 py-4 shadow-lg backdrop-blur-md transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-white"
                />
              </div>

              <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    filter === "all"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                   All ({tasks.length})
                </button>

                <button
                  onClick={() => setFilter("active")}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    filter === "active"
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                   Active ({tasks.filter((t) => !t.completed).length})
                </button>

                <button
                  onClick={() => setFilter("completed")}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    filter === "completed"
                      ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                   Completed ({tasks.filter((t) => t.completed).length})
                </button>
              </div>

              <TaskList
                key="tasks"
                tasks={filteredTasks}
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
        onReschedule={rescheduleTask}
        onChangePriority={changeTaskPriority}
      />
    </AppShell>
  );
}
