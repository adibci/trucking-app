import { cn } from '../../lib/utils'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, padding = 'md', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        padding === 'none' && '',
        padding === 'sm' && 'p-3',
        padding === 'md' && 'p-4',
        padding === 'lg' && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <h3 className={cn('text-sm font-600 text-text1', className)} {...props}>
      {children}
    </h3>
  )
}
