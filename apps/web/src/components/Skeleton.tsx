import type { CSSProperties } from 'react'
import './Skeleton.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  className?: string
}

// Shimmering placeholder block; the parent layout should be aria-hidden.
export function Skeleton({ width = '100%', height, className }: SkeletonProps) {
  return <span className={className ? `skeleton ${className}` : 'skeleton'} style={{ width, height }} />
}
