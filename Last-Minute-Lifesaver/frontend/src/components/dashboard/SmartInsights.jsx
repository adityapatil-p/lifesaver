import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { useTasks } from "../../context/TaskContext";

function isCompleted(task) {
  return task.status === "completed" || task.status === "done";
}

function isToday(task) {
  return task.deadline && new Date(task.deadline).toDateString() === new Date().toDateString();
}

function isOverdue(task) {
  return task.deadline && !isCompleted(task) && new Date(task.deadline) < new Date();
}

export function SmartInsights() {
  const { tasks } = useTasks();
  const completed = tasks.filter(isCompleted).length;
  const pending = tasks.length - completed;
  const critical = tasks.filter((task) => task.priority === "critical" && !isCompleted(task)).length;
  const today = tasks.filter(isToday).length;
  const overdue = tasks.filter(isOverdue).length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const insights = [
    {
      id: "critical",
      metric: critical,
      label: "Critical Tasks",
      trend: critical > 0 ? "down" : "up",
      detail: `${today} due today · ${overdue} overdue`,
    },
    {
      id: "status",
      metric: `${completed}/${tasks.length}`,
      label: "Completed",
      trend: completionRate >= 50 ? "up" : "down",
      detail: `${pending} pending · ${completionRate}% completion rate`,
    },
    {
      id: "overdue",
      metric: overdue,
      label: "Overdue",
      trend: overdue > 0 ? "down" : "up",
      detail: overdue > 0 ? "Needs attention now." : "No overdue tasks.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <GlassCard className="h-full">
            <div className="flex items-start justify-between mb-3">
              <Lightbulb className="w-5 h-5 text-amber-400" />

              {insight.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-brand-400" />
              )}
            </div>

            <p className="text-2xl font-bold gradient-text mb-1">
              {insight.metric}
            </p>

            <p className="text-sm font-medium text-zinc-300 mb-2">
              {insight.label}
            </p>

            <p className="text-xs text-zinc-500 leading-relaxed">
              {insight.detail}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
