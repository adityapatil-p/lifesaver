import { motion } from "framer-motion";
import { Sparkles, Zap, Clock, Brain } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { useTasks } from "../../context/TaskContext";

const iconMap = {
  zap: Zap,
  clock: Clock,
  brain: Brain,
};

function isCompleted(task) {
  return task.status === "completed" || task.status === "done";
}

export function AIRecommendations() {
  const { tasks } = useTasks();

  const recommendations = [];

  const highPriority = tasks.filter(
    (task) => (task.priority === "high" || task.priority === "critical") && !isCompleted(task)
  );

  if (highPriority.length > 0) {
    recommendations.push({
      id: 1,
      icon: "zap",
      title: "Complete High Priority Tasks",
      description: `${highPriority.length} high priority task(s) need immediate attention.`,
      impact: "high",
    });
  }

  const pendingTasks = tasks.filter(
    (task) => !isCompleted(task)
  );

  if (pendingTasks.length > 0) {
    recommendations.push({
      id: 2,
      icon: "brain",
      title: "Focus on Pending Work",
      description: `You still have ${pendingTasks.length} pending task(s).`,
      impact: "medium",
    });
  }

  const todayTasks = tasks.filter((task) => {
    if (!task.deadline) return false;

    const today = new Date().toDateString();
    return new Date(task.deadline).toDateString() === today;
  });

  if (todayTasks.length > 0) {
    recommendations.push({
      id: 3,
      icon: "clock",
      title: "Today's Deadlines",
      description: `${todayTasks.length} task(s) are due today.`,
      impact: "high",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 4,
      icon: "brain",
      title: "Everything Looks Good",
      description: "No urgent recommendations at the moment.",
      impact: "medium",
    });
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-accent-violet" />
        <h3 className="font-semibold text-zinc-100">
          AI Recommendations
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const Icon = iconMap[rec.icon] || Sparkles;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-brand-500/5 to-transparent border border-white/[0.05] hover:border-brand-500/15 transition-all"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/10 shrink-0">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-zinc-200">
                    {rec.title}
                  </p>

                  <Badge
                    variant={
                      rec.impact === "high"
                        ? "high"
                        : "medium"
                    }
                  >
                    {rec.impact}
                  </Badge>
                </div>

                <p className="text-xs text-zinc-500">
                  {rec.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
