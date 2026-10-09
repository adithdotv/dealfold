import type { Comparison, Offer, OfferFlag, VariantOption } from '../api/types'

const FLAG_LABELS: Record<OfferFlag, string> = {
  availability_unconfirmed: 'Stock not confirmed',
  variant_unconfirmed: 'Variant not confirmed',
  variant_mismatch: 'Different variant',
  conditional_price: 'Eligibility required',
  unusually_low: 'Unusually low price',
  unusually_high: 'Unusually high price',
}

export function flagLabel(flag: OfferFlag): string {
  return FLAG_LABELS[flag] ?? flag
}

// The API lists eligible offers first, so the first `eligible_count` offers are the ranked ones.
export function eligibleOffers(comparison: Comparison): Offer[] {
  return comparison.offers.slice(0, comparison.stats.eligible_count)
}

export function savingsFromOriginal(offer: Offer): number {
  if (!offer.original_price || !offer.final_price) return 0
  return Math.max(0, offer.original_price - offer.final_price)
}

// Variant links point at the SerpAPI product endpoint; its page_token opens that variant.
export function variantPageToken(option: VariantOption): string | null {
  if (!option.serpapi_link) return null
  try {
    return new URL(option.serpapi_link).searchParams.get('page_token')
  } catch (error) {
    console.error('Invalid variant link', error)
    return null
  }
}

export function isAnyVariantOption(option: VariantOption): boolean {
  return option.name.toLowerCase().startsWith('any')
}
