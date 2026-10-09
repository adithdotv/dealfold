import type { Comparison, SearchResult } from './types'

// Every API call costs a SerpAPI request, so identical requests are shared for the session.
const responseCache = new Map<string, Promise<unknown>>()

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const body = await getCachedJson(`/api/search?q=${encodeURIComponent(query)}`)
  if (!isRecord(body)) throw new Error('The search service returned an unexpected response.')

  // SerpAPI omits shopping_results entirely when nothing matches.
  const results = Array.isArray(body.shopping_results) ? body.shopping_results : []
  return results.filter(isSearchResult)
}

export async function getComparison(token: string, query: string): Promise<Comparison> {
  const params = new URLSearchParams({ token, q: query })
  const body = await getCachedJson(`/api/product?${params}`)
  if (!isComparison(body)) throw new Error('The comparison service returned an unexpected response.')
  return body
}

function getCachedJson(path: string): Promise<unknown> {
  const cachedResponse = responseCache.get(path)
  if (cachedResponse) return cachedResponse

  const response = fetchJson(path).catch((error: unknown) => {
    responseCache.delete(path)
    throw error
  })
  responseCache.set(path, response)
  return response
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}. Please try again.`)
  }

  const body: unknown = await response.json()
  if (isRecord(body) && typeof body.error === 'string') throw new Error(body.error)
  return body
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSearchResult(value: unknown): value is SearchResult {
  return isRecord(value) && typeof value.title === 'string' && typeof value.position === 'number'
}

function isComparison(value: unknown): value is Comparison {
  return (
    isRecord(value) &&
    isRecord(value.product) &&
    isRecord(value.stats) &&
    Array.isArray(value.offers) &&
    Array.isArray(value.selected_variants)
  )
}
