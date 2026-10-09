import arrowIcon from '../../assets/icons/arrow-right.svg'
import checkIcon from '../../assets/icons/check-16.svg'
import type { BestOffer } from '../../api/types'
import { buttonClassName } from '../../components/buttonClassName'
import { formatPrice } from '../../utils/format'
import { savingsFromOriginal } from '../../utils/offers'
import './BestOfferCard.css'

export function BestOfferCard({ offer }: { offer: BestOffer }) {
  const savings = savingsFromOriginal(offer)

  return (
    <section className="best-offer" aria-label="Lowest total price">
      <div className="best-offer__header">
        <div className="best-offer__summary">
          <p className="text-small text-secondary">LOWEST TOTAL PRICE</p>
          {offer.final_price !== null && <p className="text-h2">{formatPrice(offer.final_price)}</p>}
          <p className="text-body-medium">{offer.store}</p>
        </div>
        {savings > 0 && <p className="text-body-medium text-success">Save {formatPrice(savings)}</p>}
      </div>
      <ul className="best-offer__reasons">
        {offer.reasons.map((reason) => (
          <li key={reason}>
            <img src={checkIcon} width={16} height={16} alt="" />
            {reason}
          </li>
        ))}
      </ul>
      {offer.link && (
        <a
          href={offer.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClassName('secondary')} best-offer__buy`}
        >
          Buy now
          <img src={arrowIcon} width={16} height={16} alt="" />
        </a>
      )}
    </section>
  )
}
