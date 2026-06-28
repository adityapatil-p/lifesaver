import { motion } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  Coffee,
  Users,
  Shield,
  RefreshCw,
  Brain,
} from "lucide-react";

import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const typeConfig = {
  focus: {
    icon: Brain,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  break: {
    icon: Coffee,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  meeting: {
    icon: Users,
    color: "text-accent-violet",
    bg: "bg-accent-violet/10",
  },
  buffer: {
    icon: Shield,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
};

const riskColors = {
  low: "low",
  medium: "medium",
  high: "critical",
};

export function AISchedule({
  data = [],
  loading = false,
  reload,
}) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-violet" />
          <h3 className="font-semibold text-zinc-100">
            AI Generated Schedule
          </h3>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={reload}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      {!loading && data.length === 0 && (
        <p className="text-zinc-500 text-sm">
          No tasks to schedule.
        </p>
      )}

      <div className="relative">
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-brand-500/50 via-accent-violet/30 to-transparent" />

        <div className="space-y-1">
          {data.map((item, i) => {
            const config = typeConfig[item.type] || typeConfig.focus;
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className="relative flex gap-4 p-3 rounded-xl hover:bg-white/[0.03]"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-brand-400">
                      {item.time}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {item.duration}
                    </span>

                    {item.risk && (
                      <Badge
                        variant={riskColors[item.risk] || "medium"}
                      >
                        {item.risk}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-zinc-300">
                    {item.task}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

export function DeadlineRiskAnalysis({
  data = [],
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle className="w-5 h-5 text-amber-400" />

        <h3 className="font-semibold text-zinc-100">
          Deadline Risk Analysis
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No deadline risks found.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((risk, i) => (
            <motion.div
              key={risk.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-200 font-medium">
                  {risk.task}
                </p>

                <Badge
                  variant={riskColors[risk.risk] || "medium"}
                >
                  {risk.risk}
                </Badge>
              </div>

              <p className="text-xs text-zinc-500">
                {risk.suggestion}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export function ProductivitySuggestions({
  data = [],
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-accent-cyan" />

        <h3 className="font-semibold text-zinc-100">
          Productivity Suggestions
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No AI suggestions available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl bg-gradient-to-br from-brand-500/5 to-accent-violet/5 border border-white/[0.05]"
            >
              <p className="text-sm font-medium text-zinc-200">
                {item.title}
              </p>

              <p className="text-xs text-zinc-500 mt-2">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}