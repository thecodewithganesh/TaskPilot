import { useTaskCapture } from "../hooks/useTaskCapture";
import { CaptureBar } from "../components/capture/Capturebar";
import { LoadingState } from "../components/feedback/LoadingState";
import { ErrorState } from "../components/feedback/ErrorState";
import { EmptyState } from "../components/feedback/EmptyState";
import { TaskList } from "../components/tasks/TaskList";

export function CapturePage() {
  const { tasks, status, error, captureTask, retryLastCapture } = useTaskCapture();

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[640px] flex-col px-4 pt-16 pb-8 sm:px-6 sm:pt-24">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            TaskPilot
          </h1>

          <p className="mt-2 text-base text-neutral-500 sm:text-lg">
            What do you need to remember?
          </p>
        </header>

        <section className="w-full">
          <CaptureBar status={status} captureTask={captureTask} />
        </section>

        <div className="mt-8 w-full">
          {status === "loading" ? (
            <LoadingState />
          ) : status === "error" ? (
            <ErrorState
              message={error ?? "Something went wrong."}
              onRetry={retryLastCapture}
            />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <TaskList tasks={tasks} />
          )}
        </div>
      </div>
    </main>
  );
}