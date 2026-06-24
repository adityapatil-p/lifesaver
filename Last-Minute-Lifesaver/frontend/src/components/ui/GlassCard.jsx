import { cn } from '../../utils/cn'

export function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-5 transition-all duration-300',
        hover && 'hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-xl hover:shadow-brand-500/5',
        'light:hover:bg-white/90',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
