import { useEffect, useState } from 'react'

export type RequestState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }

interface SettledRequest<T> {
  request: () => Promise<T>
  state: RequestState<T>
}

const LOADING = { status: 'loading' } as const

// `request` must be memoized (useCallback); a new function identity starts a new request.
export function useRequest<T>(request: () => Promise<T>): RequestState<T> {
  const [settled, setSettled] = useState<SettledRequest<T> | null>(null)

  useEffect(() => {
    let isCurrent = true

    request().then(
      (data) => {
        if (isCurrent) setSettled({ request, state: { status: 'success', data } })
      },
      (error: unknown) => {
        if (!isCurrent) return
        console.error(error)
        setSettled({ request, state: { status: 'error', message: toErrorMessage(error) } })
      },
    )

    return () => {
      isCurrent = false
    }
  }, [request])

  if (settled?.request !== request) return LOADING
  return settled.state
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
