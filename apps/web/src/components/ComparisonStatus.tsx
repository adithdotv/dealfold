import { Link } from 'react-router-dom'
import type { RequestState } from '../hooks/useRequest'
import { LoadingState } from './LoadingState'
import { Skeleton } from './Skeleton'
import { StatusMessage } from './StatusMessage'
import './ComparisonStatus.css'

const LOADING_STEPS = [
  'Finding every store that sells it',
  'Checking stock, delivery and returns',
  'Matching the exact variant',
  'Calculating the lowest total price',
]

const SKELETON_OFFER_COUNT = 4

interface ComparisonStatusProps {
  request: Exclude<RequestState<unknown>, { status: 'success' }>
}

export function ComparisonStatus({ request }: ComparisonStatusProps) {
  if (request.status === 'loading') {
    return (
      <div className="comparison-loading">
        <LoadingState title="Comparing prices across stores" steps={LOADING_STEPS} />
        <ComparisonSkeleton />
      </div>
    )
  }

  return (
    <StatusMessage
      title="We couldn't load this product"
      description={request.message}
      action={<Link to="/" className="text-link">Back to home</Link>}
    />
  )
}

export function MissingProduct() {
  return (
    <StatusMessage
      title="No product selected"
      description="Search for a product and choose Compare prices to see store offers."
      action={<Link to="/" className="text-link">Back to home</Link>}
    />
  )
}

// Product image, details and a short list of store offers, shared by the product and compare pages.
function ComparisonSkeleton() {
  return (
    <div className="comparison-skeleton" aria-hidden="true">
      <Skeleton className="comparison-skeleton__image" />
      <div className="comparison-skeleton__info">
        <Skeleton width="25%" height={16} />
        <Skeleton width="85%" height={36} />
        <Skeleton width="40%" height={16} />
        <Skeleton width="35%" height={40} />
        <Skeleton height={48} />
        <div className="comparison-skeleton__offers card">
          {Array.from({ length: SKELETON_OFFER_COUNT }, (_, index) => (
            <div key={index} className="comparison-skeleton__offer">
              <Skeleton width={32} height={32} />
              <Skeleton width="40%" height={16} />
              <Skeleton width={72} height={20} className="comparison-skeleton__price" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
