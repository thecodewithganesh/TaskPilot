import type { Task } from "../../types/task.types";
import {
  Brain,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

interface SmartInsightsProps {
  tasks: Task[];
}

export function SmartInsights({ tasks }: SmartInsightsProps) {
  const today = new Date();

  const pending = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;

  const overdue = tasks.filter((task) => {
    if (!task.deadline || task.completed) return false;
    return new Date(task.deadline) < today;
  }).length;

  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);

  const dueThisWeek = tasks.filter((task) => {
    if (!task.deadline || task.completed) return false;
    const deadline = new Date(task.deadline);
    return deadline >= today && deadline <= weekFromNow;
  }).length;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-100 p-3 dark:bg-violet-900/30">
          <Brain className="h-7 w-7 text-violet-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            AI Smart Insights
          </h2>

          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Your productivity at a glance
          </p>
        </div>
      </div>

      <div className="grid gap-4">

        <InsightCard
          icon={<ClipboardList className="h-6 w-6 text-violet-500" />}
          title="Pending Tasks"
          value={pending}
          color="bg-violet-500/10"
        />

        <InsightCard
          icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
          title="Completed Tasks"
          value={completed}
          color="bg-green-500/10"
        />

        <InsightCard
          icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
          title="Overdue Tasks"
          value={overdue}
          color="bg-orange-500/10"
        />

        <InsightCard
          icon={<CalendarDays className="h-6 w-6 text-blue-500" />}
          title="Due This Week"
          value={dueThisWeek}
          color="bg-blue-500/10"
        />

      </div>
    </div>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

function InsightCard({
  icon,
  title,
  value,
  color,
}: CardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:scale-[1.01] hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">

      <div className="flex items-center gap-4">

        <div className={`rounded-xl p-3 ${color}`}>
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            {title}
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {title.toLowerCase()}
          </p>
        </div>

      </div>

      <span className="rounded-xl bg-neutral-200 px-4 py-2 text-2xl font-bold dark:bg-neutral-700 dark:text-white">
        {value}
      </span>

    </div>
  );
}