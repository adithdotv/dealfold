const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const compactCountFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function formatReviewCount(count: number): string {
  return compactCountFormatter.format(count).toLowerCase()
}

export function formatRating(rating: number, reviews?: number | null): string {
  if (!reviews) return `★ ${rating}`
  return `★ ${rating} (${formatReviewCount(reviews)} reviews)`
}

export function percentBelow(price: number, reference: number): number {
  if (reference <= 0 || price >= reference) return 0
  return Math.round(((reference - price) / reference) * 100)
}
