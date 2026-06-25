import { AnimatePresence } from "framer-motion";
import { useTaskCapture } from "../hooks/useTaskCapture";
import { CaptureBar } from "../components/capture/Capturebar";
import { LoadingState } from "../components/feedback/LoadingState";
import { ErrorState } from "../components/feedback/ErrorState";
import { EmptyState } from "../components/feedback/EmptyState";
import { TaskList } from "../components/tasks/TaskList";
import { AppShell } from "../components/layout/Appshell";
import { DarkModeToggle } from "../components/layout/DarkModeToggle";
import { TaskStats } from "../components/tasks/TaskStats";
import { useState } from "react";

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
  } = useTaskCapture();

  const [filter, setFilter] = useState("all");
  const filteredTasks = tasks
  .filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  })
  .filter((task) =>
    task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const [searchQuery, setSearchQuery] = useState("");

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
  <TaskStats tasks={tasks} />

  <div className="mb-4 flex gap-2">
    <button
      onClick={() => setFilter("all")}
      className={`rounded-xl px-4 py-2 ${
        filter === "all"
          ? "bg-blue-500 text-white"
          : "bg-neutral-200 dark:bg-neutral-700"
      }`}
    >
      All
    </button>

    <div className="mb-4">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2 text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
  />
</div>

    <button
      onClick={() => setFilter("active")}
      className={`rounded-xl px-4 py-2 ${
        filter === "active"
          ? "bg-blue-500 text-white"
          : "bg-neutral-200 dark:bg-neutral-700"
      }`}
    >
      Active
    </button>

    <button
      onClick={() => setFilter("completed")}
      className={`rounded-xl px-4 py-2 ${
        filter === "completed"
          ? "bg-blue-500 text-white"
          : "bg-neutral-200 dark:bg-neutral-700"
      }`}
    >
      Completed
    </button>
  </div>

  <TaskList
    key="tasks"
    tasks={filteredTasks}
    onToggleComplete={toggleTaskCompletion}
    onDelete={deleteTask}
  />
</>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}