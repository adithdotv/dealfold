import type { ReactNode } from 'react'
import './Badge.css'

type BadgeTone = 'success' | 'warning' | 'neutral'

interface BadgeProps {
  tone: BadgeTone
  icon?: string
  children: ReactNode
}

export function Badge({ tone, icon, children }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`}>
      {icon && <img src={icon} width={14} height={14} alt="" />}
      {children}
    </span>
  )
}
