import { motion } from "framer-motion";
import type { Task } from "../../types/task.types";
import { TaskCard } from "./TaskCard";

export interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onReschedule: (id: string, newDate: string) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onReschedule,
}: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex w-full flex-col gap-3"
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onReschedule={onReschedule}
        />
      ))}
    </motion.div>
  );
}