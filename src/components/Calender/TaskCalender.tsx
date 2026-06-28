import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Task } from "../../types/task.types";

interface TaskCalendarProps {
  tasks: Task[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export function TaskCalendar({
  tasks,
  selectedDate,
  onDateChange,
}: TaskCalendarProps) {

    function hasTask(date: Date) {
  return tasks.some((task) => {
    if (!task.deadline) return false;

    return (
      new Date(task.deadline).toDateString() ===
      date.toDateString()
    );
  });
}
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
        📅 Calendar
      </h2>

      <Calendar
        value={selectedDate}
        onChange={(value) => onDateChange(value as Date)}
        tileContent={({ date, view }) =>
            view === "month" && hasTask(date) ? (
        <div className="flex justify-center">
      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
    </div>
  ) : null
}
      />

      <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
        Selected Date:{" "}
        {selectedDate
          ? selectedDate.toLocaleDateString()
          : "No date selected"}
      </p>
    </div>
  );
}