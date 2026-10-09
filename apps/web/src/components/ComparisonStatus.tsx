import { Link } from 'react-router-dom'
import type { RequestState } from '../hooks/useRequest'
import { StatusMessage } from './StatusMessage'

interface ComparisonStatusProps {
  request: Exclude<RequestState<unknown>, { status: 'success' }>
}

export function ComparisonStatus({ request }: ComparisonStatusProps) {
  if (request.status === 'loading') {
    return (
      <StatusMessage
        title="Comparing prices across stores"
        description="Checking every store for the same product. This can take a few seconds."
      />
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
