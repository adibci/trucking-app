import { cn } from '../../lib/utils'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-base',
        variant === 'primary' && 'bg-brand text-white hover:bg-brand/90 shadow-sm',
        variant === 'secondary' && 'bg-brand-mid text-white hover:bg-brand-mid/90 shadow-sm',
        variant === 'outline' && 'border border-gray-200 text-text1 hover:bg-gray-50',
        variant === 'ghost' && 'text-text2 hover:bg-gray-100',
        variant === 'danger' && 'bg-em-red text-white hover:bg-em-red/90',
        variant === 'accent' && 'bg-accent text-white hover:bg-accent/90 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
