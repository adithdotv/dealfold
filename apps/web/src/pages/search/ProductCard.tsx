import { Link } from 'react-router-dom'
import arrowIcon from '../../assets/icons/arrow-right-inverse.svg'
import packageIcon from '../../assets/icons/package-40.svg'
import trendingDownIcon from '../../assets/icons/trending-down-14.svg'
import type { SearchResult } from '../../api/types'
import { Badge } from '../../components/Badge'
import { ProductImage } from '../../components/ProductImage'
import { buttonClassName } from '../../components/buttonClassName'
import { formatPrice, formatRating } from '../../utils/format'
import { productPath } from '../../utils/routes'
import { discountPercent } from './searchFilters'
import './ProductCard.css'

interface ProductCardProps {
  result: SearchResult
  query: string
}

export function ProductCard({ result, query }: ProductCardProps) {
  const discount = discountPercent(result)
  const token = result.immersive_product_page_token
  const storeLabel = result.multiple_sources ? `${result.source} and more` : result.source

  return (
    <article className="product-card card">
      <ProductImage
        src={result.thumbnail}
        alt={result.title}
        placeholderIcon={packageIcon}
        placeholderSize={40}
        className="product-card__image"
      />
      <div className="product-card__body">
        <div className="product-card__heading">
          {storeLabel && <p className="text-caption text-muted">{storeLabel}</p>}
          <h3 className="text-h4 product-card__title" title={result.title}>
            {result.title}
          </h3>
        </div>
        {result.rating ? (
          <p className="text-caption text-secondary">{formatRating(result.rating, result.reviews)}</p>
        ) : null}
        {result.extracted_price !== undefined && (
          <div>
            <p className="text-small text-secondary">From</p>
            <p className="text-h3">{formatPrice(result.extracted_price)}</p>
          </div>
        )}
        <div className="product-card__signal">
          {result.delivery && <span className="text-caption text-secondary">{result.delivery}</span>}
          {discount > 0 && (
            <Badge tone="success" icon={trendingDownIcon}>
              {discount}% off
            </Badge>
          )}
        </div>
        {token ? (
          <Link to={productPath(token, query)} className={buttonClassName('primary', { fullWidth: true })}>
            Compare prices
            <img src={arrowIcon} width={16} height={16} alt="" />
          </Link>
        ) : (
          <button type="button" className={buttonClassName('primary', { fullWidth: true })} disabled>
            Comparison unavailable
          </button>
        )}
      </div>
    </article>
  )
}
