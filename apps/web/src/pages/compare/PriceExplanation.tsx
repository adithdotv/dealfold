import alertIcon from '../../assets/icons/alert.svg'
import checkIcon from '../../assets/icons/check-18.svg'
import type { BestOffer } from '../../api/types'
import { Badge } from '../../components/Badge'
import { formatPrice } from '../../utils/format'
import { savingsFromOriginal } from '../../utils/offers'
import './PriceExplanation.css'

interface PriceExplanationProps {
  best: BestOffer
  excludedStoreCount: number
}

export function PriceExplanation({ best, excludedStoreCount }: PriceExplanationProps) {
  const finalPrice = best.final_price ?? 0
  const savings = savingsFromOriginal(best)

  return (
    <div className="price-explanation">
      <section className="card price-explanation__why">
        <h2 className="text-h3">Why this price wins</h2>
        <p className="text-h4">
          {best.store} has the lowest final price: {formatPrice(finalPrice)}.
        </p>
        <ul className="price-explanation__reasons">
          {best.reasons.map((reason) => (
            <li key={reason}>
              <img src={checkIcon} width={18} height={18} alt="" />
              {reason}
            </li>
          ))}
        </ul>
        {excludedStoreCount > 0 && (
          <p className="text-caption text-secondary">
            {excludedStoreCount} {excludedStoreCount === 1 ? 'store was' : 'stores were'} left out of the
            ranking because stock, variant or eligibility could not be confirmed.
          </p>
        )}
        {best.coupon && (
          <Badge tone="warning" icon={alertIcon}>
            Offer conditions apply
          </Badge>
        )}
      </section>

      <section className="card price-explanation__breakdown">
        <h2 className="text-h3">True price: {best.store}</h2>
        <dl className="price-explanation__rows">
          <BreakdownRow label="Product price" value={formatPrice(best.listed_price ?? finalPrice)} />
          <BreakdownRow label="Delivery" value={best.delivery_fee ? formatPrice(best.delivery_fee) : 'Free'} />
          <BreakdownRow label="Coupon" value={best.coupon ?? 'None'} muted={!best.coupon} />
        </dl>
        <hr className="price-explanation__divider" />
        <div className="price-explanation__final">
          <p className="text-secondary">Final price</p>
          <p className="text-h2">{formatPrice(finalPrice)}</p>
          {savings > 0 && (
            <p className="text-body-medium text-success">
              You save {formatPrice(savings)} compared with the original price.
            </p>
          )}
        </div>
        <p className="text-caption text-secondary">
          Buy now opens {best.store} in a new tab. Dealfold does not handle checkout or payment.
        </p>
      </section>
    </div>
  )
}

interface BreakdownRowProps {
  label: string
  value: string
  muted?: boolean
}

function BreakdownRow({ label, value, muted = false }: BreakdownRowProps) {
  return (
    <div className="price-explanation__row">
      <dt className="text-secondary">{label}</dt>
      <dd className={muted ? 'text-body-medium text-muted' : 'text-body-medium'}>{value}</dd>
    </div>
  )
}
