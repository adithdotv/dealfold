import checkIcon from '../../assets/icons/check-14.svg'
import alertIcon from '../../assets/icons/alert.svg'
import type { Offer } from '../../api/types'
import { Badge } from '../../components/Badge'
import { buttonClassName } from '../../components/buttonClassName'
import { formatPrice } from '../../utils/format'
import { flagLabel, savingsFromOriginal } from '../../utils/offers'
import './OfferTable.css'

export function OfferTable({ offers }: { offers: Offer[] }) {
  return (
    <div className="offer-table card">
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Product price</th>
            <th>Delivery</th>
            <th>Discount</th>
            <th>Final price</th>
            <th>
              <span className="visually-hidden">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, index) => (
            <OfferRow key={`${offer.store}-${index}`} offer={offer} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OfferRow({ offer }: { offer: Offer }) {
  const savings = savingsFromOriginal(offer)
  const buyButtonVariant = offer.is_best ? 'primary' : 'secondary'

  return (
    <tr className={offer.is_best ? 'offer-table__row--best' : undefined}>
      <td>
        <div className="offer-table__cell">
          <span className="text-body-medium">{offer.store}</span>
          {offer.is_best && (
            <Badge tone="success" icon={checkIcon}>
              Cheapest
            </Badge>
          )}
          {offer.flags.map((flag) => (
            <Badge key={flag} tone="warning" icon={alertIcon}>
              {flagLabel(flag)}
            </Badge>
          ))}
        </div>
      </td>
      <td>{offer.listed_price !== null ? formatPrice(offer.listed_price) : '—'}</td>
      <td>{offer.delivery_fee ? formatPrice(offer.delivery_fee) : 'Free'}</td>
      <td>
        <DiscountCell offer={offer} hasSavings={savings > 0} />
      </td>
      <td>
        <div className="offer-table__cell">
          <span className="text-h3">{offer.final_price !== null ? formatPrice(offer.final_price) : '—'}</span>
          {savings > 0 ? (
            <span className="text-caption text-success">Save {formatPrice(savings)}</span>
          ) : (
            <span className="text-caption text-secondary">No saving</span>
          )}
        </div>
      </td>
      <td className="offer-table__action">
        {offer.link && (
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName(buyButtonVariant)}
          >
            Buy now
          </a>
        )}
      </td>
    </tr>
  )
}

// Stores also report reference prices ("Usually ₹26,926") that are not an actual saving.
function DiscountCell({ offer, hasSavings }: { offer: Offer; hasSavings: boolean }) {
  const discountTone = hasSavings ? 'text-success' : 'text-secondary'

  if (!offer.discount && !offer.coupon) {
    return (
      <div className="offer-table__cell text-secondary">
        <span className="text-body-medium">No offer</span>
        <span className="text-caption">No coupon or discount found</span>
      </div>
    )
  }

  return (
    <div className="offer-table__cell">
      {offer.discount && <span className={`text-body-medium ${discountTone}`}>{offer.discount}</span>}
      {offer.coupon && <span className="text-caption text-warning">Coupon: {offer.coupon}</span>}
    </div>
  )
}
