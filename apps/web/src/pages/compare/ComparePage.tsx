import { useState } from 'react'
import { Link } from 'react-router-dom'
import checkCircleIcon from '../../assets/icons/check-circle.svg'
import packageIcon from '../../assets/icons/package-32.svg'
import type { Comparison, Offer } from '../../api/types'
import { Badge } from '../../components/Badge'
import { ComparisonStatus, MissingProduct } from '../../components/ComparisonStatus'
import { ProductImage } from '../../components/ProductImage'
import { SortSelect } from '../../components/SortSelect'
import { StatusMessage } from '../../components/StatusMessage'
import { useComparison } from '../../hooks/useComparison'
import { useProductParams } from '../../hooks/useProductParams'
import { productPath } from '../../utils/routes'
import { OfferTable } from './OfferTable'
import { PriceExplanation } from './PriceExplanation'
import './ComparePage.css'

type OfferSortOrder = 'lowest_total' | 'store_name'

const SORT_OPTIONS: { value: OfferSortOrder; label: string }[] = [
  { value: 'lowest_total', label: 'Lowest total price' },
  { value: 'store_name', label: 'Store name' },
]

const VARIANT_FLAGS = new Set(['variant_unconfirmed', 'variant_mismatch'])

export function ComparePage() {
  const { token, query } = useProductParams()

  return (
    <div className="page compare-page">
      {token ? <CompareContent token={token} query={query} /> : <MissingProduct />}
    </div>
  )
}

function CompareContent({ token, query }: { token: string; query: string }) {
  const comparisonRequest = useComparison(token, query)

  if (comparisonRequest.status !== 'success') return <ComparisonStatus request={comparisonRequest} />
  return <CompareDetails comparison={comparisonRequest.data} productLink={productPath(token, query)} />
}

interface CompareDetailsProps {
  comparison: Comparison
  productLink: string
}

function CompareDetails({ comparison, productLink }: CompareDetailsProps) {
  const [sortOrder, setSortOrder] = useState<OfferSortOrder>('lowest_total')
  const { product, best, stats } = comparison
  const title = product.title ?? 'Product'
  const sameVariantCount = comparison.offers.filter(
    (offer) => !offer.flags.some((flag) => VARIANT_FLAGS.has(flag)),
  ).length

  return (
    <>
      <section className="compare-page__product">
        <ProductImage
          src={product.thumbnail}
          alt={title}
          placeholderIcon={packageIcon}
          placeholderSize={32}
          className="compare-page__thumbnail"
        />
        <div className="compare-page__product-info">
          <p className="text-h3">{title}</p>
          {comparison.selected_variants.length > 0 && (
            <div className="compare-page__chips">
              {comparison.selected_variants.map((variant) => (
                <span key={variant} className="compare-page__variant-chip">
                  {variant}
                </span>
              ))}
              <Badge tone="success" icon={checkCircleIcon}>
                Same variant at {sameVariantCount} of {stats.store_count} stores
              </Badge>
            </div>
          )}
        </div>
        <Link to={productLink} className="text-link">
          {product.variants.length ? 'Change variant' : 'Back to product'}
        </Link>
      </section>

      <div className="compare-page__title-row">
        <div className="compare-page__title">
          <h1 className="text-h2">Compare prices</h1>
          <p className="text-secondary">
            {stats.store_count} stores · final price = product price + delivery − discounts
          </p>
        </div>
        <SortSelect value={sortOrder} options={SORT_OPTIONS} onChange={setSortOrder} />
      </div>

      {comparison.offers.length ? (
        <OfferTable offers={sortOffers(comparison.offers, sortOrder)} />
      ) : (
        <StatusMessage title="No store offers found" description="No store lists this product right now." />
      )}

      {best && (
        <PriceExplanation best={best} excludedStoreCount={stats.store_count - stats.eligible_count} />
      )}
    </>
  )
}

// The API already returns offers ranked by confirmed lowest total price.
function sortOffers(offers: Offer[], order: OfferSortOrder): Offer[] {
  if (order === 'lowest_total') return offers
  return [...offers].sort((a, b) => (a.store ?? '').localeCompare(b.store ?? ''))
}
