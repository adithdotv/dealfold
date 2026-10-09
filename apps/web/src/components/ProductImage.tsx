import './ProductImage.css'

interface ProductImageProps {
  src?: string | null
  alt: string
  placeholderIcon: string
  placeholderSize: number
  className?: string
}

export function ProductImage({ src, alt, placeholderIcon, placeholderSize, className = '' }: ProductImageProps) {
  return (
    <div className={`product-image ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="product-image__photo" loading="lazy" />
      ) : (
        <img src={placeholderIcon} width={placeholderSize} height={placeholderSize} alt="" />
      )}
    </div>
  )
}
