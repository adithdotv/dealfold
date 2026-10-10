import { useEffect, useState } from 'react'

// Whole seconds since the calling component mounted.
export function useElapsedSeconds(): number {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return elapsedSeconds
}
