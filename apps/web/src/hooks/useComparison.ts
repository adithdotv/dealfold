import { useCallback } from 'react'
import { getComparison } from '../api/client'
import { useRequest } from './useRequest'

export function useComparison(token: string, query: string) {
  const loadComparison = useCallback(() => getComparison(token, query), [token, query])
  return useRequest(loadComparison)
}
