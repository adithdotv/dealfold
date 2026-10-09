import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchProducts } from '../../api/client'
import type { SearchResult } from '../../api/types'
import { SortSelect } from '../../components/SortSelect'
import { StatusMessage } from '../../components/StatusMessage'
import { useRequest } from '../../hooks/useRequest'
import { FilterSidebar } from './FilterSidebar'
import { ProductCard } from './ProductCard'
import {
  EMPTY_FILTERS,
  filterResults,
  mostCommonStores,
  sortResults,
  type SearchSortOrder,
} from './searchFilters'
import './SearchResultsPage.css'

const SORT_OPTIONS: { value: SearchSortOrder; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'lowest_price', label: 'Lowest price' },
  { value: 'highest_rating', label: 'Highest rating' },
]

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  if (!query) {
    return (
      <div className="page search-page">
        <StatusMessage
          title="Search for a product"
          description="Type a product name in the search bar to compare prices across stores."
        />
      </div>
    )
  }

  // Keyed by query so filters and sorting reset for every new search.
  return <SearchResults key={query} query={query} />
}

function SearchResults({ query }: { query: string }) {
  const loadResults = useCallback(() => searchProducts(query), [query])
  const resultsRequest = useRequest(loadResults)

  return (
    <div className="page search-page">
      {resultsRequest.status === 'loading' && (
        <StatusMessage title={`Searching stores for "${query}"`} description="This can take a few seconds." />
      )}
      {resultsRequest.status === 'error' && (
        <StatusMessage
          title="We couldn't load results"
          description={resultsRequest.message}
          action={<Link to="/" className="text-link">Back to home</Link>}
        />
      )}
      {resultsRequest.status === 'success' && <ResultsView query={query} results={resultsRequest.data} />}
    </div>
  )
}

function ResultsView({ query, results }: { query: string; results: SearchResult[] }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  // Price-first ordering surfaces cheap accessories, so search ranking is the default.
  const [sortOrder, setSortOrder] = useState<SearchSortOrder>('relevance')

  const visibleResults = sortResults(filterResults(results, filters), sortOrder)
  const productCountLabel =
    visibleResults.length === results.length
      ? `${results.length} products`
      : `${visibleResults.length} of ${results.length} products`

  if (!results.length) {
    return (
      <StatusMessage
        title={`No results for "${query}"`}
        description="Try a shorter search or check the spelling."
      />
    )
  }

  return (
    <>
      <div className="search-page__header">
        <div className="search-page__heading">
          <h1 className="text-h2">Results for "{query}"</h1>
          <p className="text-secondary">{productCountLabel}</p>
        </div>
        <SortSelect value={sortOrder} options={SORT_OPTIONS} onChange={setSortOrder} />
      </div>

      <div className="search-page__body">
        <FilterSidebar filters={filters} storeOptions={mostCommonStores(results)} onChange={setFilters} />
        {visibleResults.length ? (
          <div className="search-page__grid">
            {visibleResults.map((result) => (
              <ProductCard key={result.product_id ?? result.position} result={result} query={query} />
            ))}
          </div>
        ) : (
          <StatusMessage
            title="No products match these filters"
            action={
              <button type="button" className="text-link search-page__reset" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear all filters
              </button>
            }
          />
        )}
      </div>
    </>
  )
}
