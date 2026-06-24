import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Zap,
  Globe,
  Save,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { useTheme } from '../context/ThemeContext'
import { user } from '../data/mockData'
import { cn } from '../utils/cn'

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ai', label: 'AI Preferences', icon: Zap },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'language', label: 'Language', icon: Globe },
]

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200',
        enabled ? 'bg-brand-500' : 'bg-white/10'
      )}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  )
}

export default function Settings() {
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    deadlines: true,
    aiSuggestions: false,
  })
  const [aiSettings, setAiSettings] = useState({
    autoSchedule: true,
    smartPrioritize: true,
    riskAlerts: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-500/10">
          <SettingsIcon className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Settings</h1>
          <p className="text-sm text-zinc-500">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-1 h-fit" hover={false}>
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                    activeSection === section.id
                      ? 'bg-brand-500/15 text-brand-300'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </GlassCard>

        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <GlassCard hover={false}>
              <h3 className="font-semibold text-zinc-100 mb-6">Profile Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-cyan text-xl font-bold text-white">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-200">{user.name}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300">
                    {user.plan} Plan
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block">Full Name</label>
                  <input
                    defaultValue={user.name}
                    className="w-full px-4 py-2.5 rounded-xl glass text-sm text-zinc-200 bg-transparent outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block">Email</label>
                  <input
                    defaultValue={user.email}
                    className="w-full px-4 py-2.5 rounded-xl glass text-sm text-zinc-200 bg-transparent outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block">Role</label>
                  <input
                    defaultValue={user.role}
                    className="w-full px-4 py-2.5 rounded-xl glass text-sm text-zinc-200 bg-transparent outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button size="sm">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </GlassCard>
          )}

          {activeSection === 'notifications' && (
            <GlassCard hover={false}>
              <h3 className="font-semibold text-zinc-100 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push notifications', desc: 'Browser push alerts' },
                  { key: 'deadlines', label: 'Deadline reminders', desc: 'Alerts before tasks are due' },
                  { key: 'aiSuggestions', label: 'AI suggestions', desc: 'Smart productivity tips' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={notifications[item.key]}
                      onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeSection === 'appearance' && (
            <GlassCard hover={false}>
              <h3 className="font-semibold text-zinc-100 mb-6">Appearance</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div>
                  <p className="text-sm font-medium text-zinc-200">Theme</p>
                  <p className="text-xs text-zinc-500">
                    Currently using {isDark ? 'dark' : 'light'} mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </GlassCard>
          )}

          {activeSection === 'ai' && (
            <GlassCard hover={false}>
              <h3 className="font-semibold text-zinc-100 mb-6">AI Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'autoSchedule', label: 'Auto-generate daily schedule', desc: 'AI creates optimized daily plans' },
                  { key: 'smartPrioritize', label: 'Smart prioritization', desc: 'Automatically rank tasks by urgency' },
                  { key: 'riskAlerts', label: 'Deadline risk alerts', desc: 'Warn when deadlines are at risk' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={aiSettings[item.key]}
                      onChange={(v) => setAiSettings((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {(activeSection === 'privacy' || activeSection === 'language') && (
            <GlassCard hover={false}>
              <h3 className="font-semibold text-zinc-100 mb-4 capitalize">{activeSection}</h3>
              <p className="text-sm text-zinc-500">
                {activeSection === 'privacy'
                  ? 'Your data is encrypted and never shared with third parties. AI processing happens locally when possible.'
                  : 'English (US) is currently selected. Additional languages coming soon.'}
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  )
}
