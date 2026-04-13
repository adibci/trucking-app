import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 tracking-wide',
      variant === 'default' && 'bg-brand-light text-brand-mid',
      variant === 'success' && 'bg-em-green-soft text-em-green',
      variant === 'warning' && 'bg-accent-soft text-accent',
      variant === 'danger' && 'bg-em-red-soft text-em-red',
      variant === 'info' && 'bg-blue-50 text-blue-600',
      variant === 'outline' && 'border border-gray-200 text-text2 bg-white',
      className
    )}>
      {children}
    </span>
  )
}
