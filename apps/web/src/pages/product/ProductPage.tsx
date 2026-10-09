import { Link } from 'react-router-dom'
import arrowIcon from '../../assets/icons/arrow-right-inverse.svg'
import packageIcon from '../../assets/icons/package-64.svg'
import trendingDownIcon from '../../assets/icons/trending-down-14.svg'
import type { Comparison } from '../../api/types'
import { Badge } from '../../components/Badge'
import { ComparisonStatus, MissingProduct } from '../../components/ComparisonStatus'
import { ProductImage } from '../../components/ProductImage'
import { StatusMessage } from '../../components/StatusMessage'
import { buttonClassName } from '../../components/buttonClassName'
import { useComparison } from '../../hooks/useComparison'
import { useProductParams } from '../../hooks/useProductParams'
import { formatPrice, formatRating, percentBelow } from '../../utils/format'
import { eligibleOffers } from '../../utils/offers'
import { comparePath, searchPath } from '../../utils/routes'
import { BestOfferCard } from './BestOfferCard'
import { PriceLadder } from './PriceLadder'
import { VariantPicker } from './VariantPicker'
import './ProductPage.css'

export function ProductPage() {
  const { token, query } = useProductParams()

  return (
    <div className="page product-page">
      {token ? <ProductContent token={token} query={query} /> : <MissingProduct />}
    </div>
  )
}

function ProductContent({ token, query }: { token: string; query: string }) {
  const comparisonRequest = useComparison(token, query)

  if (comparisonRequest.status !== 'success') return <ComparisonStatus request={comparisonRequest} />
  return <ProductDetails comparison={comparisonRequest.data} token={token} query={query} />
}

interface ProductDetailsProps {
  comparison: Comparison
  token: string
  query: string
}

function ProductDetails({ comparison, token, query }: ProductDetailsProps) {
  const { product, best, stats } = comparison
  const title = product.title ?? 'Product'
  const compareLink = comparePath(token, query)

  return (
    <>
      <div className="product-page__top">
        <nav className="text-caption text-secondary product-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Compare</Link>
          {query && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={searchPath(query)}>Results for "{query}"</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <section className="product-page__hero">
          <ProductImage
            src={product.thumbnail}
            alt={title}
            placeholderIcon={packageIcon}
            placeholderSize={64}
            className="product-page__image card"
          />

          <div className="product-page__info">
            <div className="product-page__identity">
              {product.brand && <p className="text-caption text-muted">{product.brand}</p>}
              <h1 className="text-h2">{title}</h1>
              {product.rating ? (
                <p className="text-caption text-secondary">{formatRating(product.rating, product.reviews)}</p>
              ) : null}
            </div>

            {product.variants.length > 0 && (
              <VariantPicker groups={product.variants} selectedNames={comparison.selected_variants} query={query} />
            )}

            {comparison.match.status === 'similar' && (
              <p className="text-caption text-warning">
                Store listings may be a different model: they don't mention{' '}
                {comparison.match.missing_terms.join(', ')}.
              </p>
            )}

            <PriceSummary comparison={comparison} />

            <Link to={compareLink} className={buttonClassName('primary', { large: true, fullWidth: true })}>
              Compare prices
              <img src={arrowIcon} width={16} height={16} alt="" />
            </Link>

            {best ? (
              <BestOfferCard offer={best} />
            ) : (
              <StatusMessage
                title="No confirmed lowest price"
                description={`We couldn't confirm stock and variant at any of the ${stats.store_count} stores.`}
              />
            )}
          </div>
        </section>
      </div>

      <PriceLadder offers={eligibleOffers(comparison)} compareLink={compareLink} />

      {product.features.length > 0 && (
        <section className="product-page__specs">
          <h2 className="text-h3">Specifications</h2>
          <dl className="card product-page__spec-table">
            {product.features.map((feature) => (
              <div key={feature.title} className="product-page__spec-row">
                <dt className="text-body-medium">{feature.title}</dt>
                <dd className="text-secondary">{feature.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  )
}

function PriceSummary({ comparison }: { comparison: Comparison }) {
  const { best, stats } = comparison
  if (stats.lowest === null) return null

  const percentBelowMedian = percentBelow(stats.lowest, stats.median)
  const originalPrice = best?.original_price ?? 0

  return (
    <div className="product-page__price">
      <p className="text-caption text-secondary">From</p>
      <div className="product-page__price-row">
        <p className="text-h2">{formatPrice(stats.lowest)}</p>
        {originalPrice > stats.lowest && (
          <s className="text-secondary product-page__original-price">{formatPrice(originalPrice)}</s>
        )}
        {percentBelowMedian > 0 && (
          <Badge tone="success" icon={trendingDownIcon}>
            {percentBelowMedian}% below median
          </Badge>
        )}
      </div>
      <p className="text-caption text-secondary">
        Lowest total price across {stats.eligible_count} confirmed stores.
      </p>
    </div>
  )
}
