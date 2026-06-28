import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  BarChart3,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/planner', icon: Sparkles, label: 'AI Planner' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({ item, collapsed, onNavigate }) {
  const location = useLocation()
  const isActive = location.pathname === item.to

  return (
    <NavLink to={item.to} onClick={onNavigate}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
          isActive
            ? 'bg-brand-500/15 text-brand-300'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
        )}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/20 to-accent-violet/10 border border-brand-500/20"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <item.icon className={cn('relative w-5 h-5 shrink-0', isActive && 'text-brand-400')} />
        {!collapsed && (
          <span className="relative text-sm font-medium">{item.label}</span>
        )}
        {isActive && !collapsed && (
          <motion.div
            layoutId="sidebar-dot"
            className="relative ml-auto w-1.5 h-1.5 rounded-full bg-brand-400"
          />
        )}
      </motion.div>
    </NavLink>
  )
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user } = useAuth()
  const displayName = user?.name || 'Guest User'
  const displayPlan = user?.plan || 'Free'
  const avatarLabel = displayName.charAt(0).toUpperCase()

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-3 py-2 mb-6">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet shadow-lg shadow-brand-500/30">
          <Zap className="w-5 h-5 text-white" />
          <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse opacity-50" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <h1 className="text-sm font-bold tracking-tight gradient-text truncate">
              Last Minute Lifesaver
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">AI Productivity</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen?.(false)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl glass cursor-pointer',
            collapsed && 'justify-center'
          )}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan text-xs font-bold text-white shrink-0">
            {avatarLabel}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200 truncate">{displayName}</p>
              <p className="text-xs text-zinc-500 truncate">{displayPlan} Plan</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 p-4 border-r border-zinc-200/50 dark:border-white/5 bg-zinc-50/90 dark:bg-[#0a0a0f]/80 backdrop-blur-2xl"
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full glass text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] flex flex-col p-4 border-r border-zinc-200/50 dark:border-white/5 bg-zinc-50/95 dark:bg-[#0a0a0f]/95 backdrop-blur-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
