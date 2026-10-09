import type { SearchResult } from '../../api/types'
import { percentBelow } from '../../utils/format'

export type SearchSortOrder = 'lowest_price' | 'highest_rating' | 'relevance'

export interface SearchFilters {
  stores: string[]
  freeDeliveryOnly: boolean
  minimumDiscountPercent: number
  minimumRating: number
}

export const EMPTY_FILTERS: SearchFilters = {
  stores: [],
  freeDeliveryOnly: false,
  minimumDiscountPercent: 0,
  minimumRating: 0,
}

const MAX_STORE_OPTIONS = 6

export function discountPercent(result: SearchResult): number {
  if (!result.extracted_price || !result.extracted_old_price) return 0
  return percentBelow(result.extracted_price, result.extracted_old_price)
}

export function hasFreeDelivery(result: SearchResult): boolean {
  return result.delivery?.toLowerCase().includes('free') ?? false
}

export function filterResults(results: SearchResult[], filters: SearchFilters): SearchResult[] {
  return results.filter((result) => {
    if (filters.stores.length && !filters.stores.includes(result.source ?? '')) return false
    if (filters.freeDeliveryOnly && !hasFreeDelivery(result)) return false
    if (discountPercent(result) < filters.minimumDiscountPercent) return false
    if ((result.rating ?? 0) < filters.minimumRating) return false
    return true
  })
}

export function sortResults(results: SearchResult[], order: SearchSortOrder): SearchResult[] {
  const sortedResults = [...results]
  if (order === 'lowest_price') {
    sortedResults.sort((a, b) => (a.extracted_price ?? Infinity) - (b.extracted_price ?? Infinity))
  }
  if (order === 'highest_rating') {
    sortedResults.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  }
  if (order === 'relevance') {
    sortedResults.sort((a, b) => a.position - b.position)
  }
  return sortedResults
}

export function mostCommonStores(results: SearchResult[]): string[] {
  const resultCountByStore = new Map<string, number>()
  for (const result of results) {
    if (!result.source) continue
    resultCountByStore.set(result.source, (resultCountByStore.get(result.source) ?? 0) + 1)
  }
  return [...resultCountByStore.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_STORE_OPTIONS)
    .map(([store]) => store)
}
