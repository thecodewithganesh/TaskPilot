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
    staggerChildren: 0.12,
    delayChildren: 0.1,
  },
},
 exit: {
  opacity: 0,
  y: 20,
  transition: {
    duration: 0.25,
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
      layout
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flexw-full flex-col gap-5 pb-24"
    >
      {tasks.map((task) => (
  <motion.div key={task.id} layout layoutId={task.id}>
    <TaskCard
      task={task}
      onToggleComplete={onToggleComplete}
      onDelete={onDelete}
      onReschedule={onReschedule}
    />
  </motion.div>
))}
    </motion.div>
  );
}