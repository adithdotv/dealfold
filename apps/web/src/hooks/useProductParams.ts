import { useSearchParams } from 'react-router-dom'

export function useProductParams() {
  const [searchParams] = useSearchParams()
  return {
    token: searchParams.get('token') ?? '',
    query: searchParams.get('q') ?? '',
  }
}
