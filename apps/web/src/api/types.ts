export interface SearchResult {
  position: number
  title: string
  product_id?: string
  immersive_product_page_token?: string
  source?: string
  multiple_sources?: boolean
  price?: string
  extracted_price?: number
  extracted_old_price?: number
  rating?: number
  reviews?: number
  thumbnail?: string
  tag?: string
  delivery?: string
}

export interface VariantOption {
  name: string
  selected?: boolean
  available?: boolean
  serpapi_link?: string
}

export interface VariantGroup {
  title: string
  items: VariantOption[]
}

export interface ProductFeature {
  title: string
  value: string
}

export type OfferFlag =
  | 'availability_unconfirmed'
  | 'variant_unconfirmed'
  | 'variant_mismatch'
  | 'conditional_price'
  | 'unusually_low'
  | 'unusually_high'

export interface Offer {
  store: string | null
  logo: string | null
  link: string | null
  title: string
  listed_price: number | null
  original_price: number | null
  delivery_fee: number
  discount: string | null
  coupon: string | null
  final_price: number | null
  delivery_text: string | null
  returns_text: string | null
  google_tag: string | null
  flags: OfferFlag[]
  is_best: boolean
}

export interface BestOffer extends Offer {
  reasons: string[]
  tied_with: string[]
}

export interface Comparison {
  product: {
    title: string | null
    brand: string | null
    rating: number | null
    reviews: number | null
    thumbnail: string | null
    price_range: string | null
    variants: VariantGroup[]
    features: ProductFeature[]
  }
  match: {
    status: 'exact' | 'similar'
    missing_terms: string[]
  }
  selected_variants: string[]
  best: BestOffer | null
  offers: Offer[]
  stats: {
    store_count: number
    eligible_count: number
    lowest: number | null
    median: number
    highest: number | null
  }
}
