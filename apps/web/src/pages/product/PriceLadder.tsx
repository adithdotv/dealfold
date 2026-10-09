import { Link } from 'react-router-dom'
import type { Offer } from '../../api/types'
import { formatPrice } from '../../utils/format'
import './PriceLadder.css'

const MAX_LADDER_ROWS = 5
// The cheapest bar keeps some length so small price gaps stay visible.
const MIN_BAR_PERCENT = 40

interface PriceLadderProps {
  offers: Offer[]
  compareLink: string
}

export function PriceLadder({ offers, compareLink }: PriceLadderProps) {
  const pricedOffers = offers.filter((offer) => offer.final_price !== null).slice(0, MAX_LADDER_ROWS)
  if (!pricedOffers.length) return null

  const prices = pricedOffers.map((offer) => offer.final_price ?? 0)
  const lowestPrice = Math.min(...prices)
  const highestPrice = Math.max(...prices)

  function barWidthPercent(price: number): number {
    if (highestPrice === lowestPrice) return MIN_BAR_PERCENT
    const position = (price - lowestPrice) / (highestPrice - lowestPrice)
    return MIN_BAR_PERCENT + position * (100 - MIN_BAR_PERCENT)
  }

  return (
    <section className="price-ladder card">
      <div className="price-ladder__header">
        <h2 className="text-h3">Price ladder</h2>
        <Link to={compareLink} className="text-link">
          Compare all stores
        </Link>
      </div>
      <ul className="price-ladder__rows">
        {pricedOffers.map((offer, index) => {
          const price = offer.final_price ?? 0
          const isLowest = index === 0
          const noteTone = isLowest ? 'text-success' : 'text-secondary'

          return (
            <li key={`${offer.store}-${index}`} className="price-ladder__row">
              <span className="text-body-medium price-ladder__store">{offer.store}</span>
              <span className="price-ladder__track">
                <span
                  className={isLowest ? 'price-ladder__bar price-ladder__bar--lowest' : 'price-ladder__bar'}
                  style={{ width: `${barWidthPercent(price)}%` }}
                />
              </span>
              <span className="text-body-medium price-ladder__price">{formatPrice(price)}</span>
              <span className={`text-caption ${noteTone} price-ladder__note`}>
                {ladderNote(price, lowestPrice, isLowest)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ladderNote(price: number, lowestPrice: number, isLowest: boolean): string {
  if (isLowest) return 'Lowest total price'
  if (price === lowestPrice) return 'Same price'
  return `+${formatPrice(price - lowestPrice)}`
}
