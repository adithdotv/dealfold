import type { ReactNode } from 'react'
import './StatusMessage.css'

interface StatusMessageProps {
  title: string
  description?: string
  action?: ReactNode
}

export function StatusMessage({ title, description, action }: StatusMessageProps) {
  return (
    <div className="status-message" role="status">
      <h2 className="text-h4">{title}</h2>
      {description && <p className="text-secondary">{description}</p>}
      {action}
    </div>
  )
}
