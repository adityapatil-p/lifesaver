import { motion } from 'framer-motion'
import { Bell, Search, Menu, Command } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Dashboard',
  '/tasks': 'Tasks',
  '/planner': 'AI Planner',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

export function Header({ onMenuClick }) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-zinc-200/50 dark:border-white/5 bg-zinc-50/80 dark:bg-[#0a0a0f]/60 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl glass hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5 text-zinc-300" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
          <p className="text-xs text-zinc-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl glass text-zinc-500 text-sm">
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="ml-6 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl glass hover:bg-white/10 transition-colors"
        >
          <Bell className="w-4.5 h-4.5 text-zinc-400" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
        </motion.button>

        <ThemeToggle />
      </div>
    </motion.header>
  )
}
