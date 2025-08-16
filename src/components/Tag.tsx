import React from 'react'
import cn from 'classnames'

export const PriorityTag: React.FC<{ level: 'low' | 'medium' | 'high' }> = ({ level }) => {
  const map = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
  } as const
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', map[level])}>{level}</span>
  )
}