import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-brand-500 to-accent-violet text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:brightness-110',
    secondary: 'glass hover:bg-white/10 text-zinc-200',
    ghost: 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
