import { Link } from 'react-router-dom'
import type { VariantGroup } from '../../api/types'
import { isAnyVariantOption, variantPageToken } from '../../utils/offers'
import { productPath } from '../../utils/routes'
import './VariantPicker.css'

interface VariantPickerProps {
  groups: VariantGroup[]
  selectedNames: string[]
  query: string
}

export function VariantPicker({ groups, selectedNames, query }: VariantPickerProps) {
  return (
    <div className="variant-picker">
      {groups.map((group) => (
        <div key={group.title} className="variant-picker__group">
          <p className="text-body-medium">{group.title}</p>
          <div className="variant-picker__options">
            {group.items.filter((option) => !isAnyVariantOption(option)).map((option) => {
              const isSelected = Boolean(option.selected) || selectedNames.includes(option.name)
              const pageToken = variantPageToken(option)
              const className = isSelected
                ? 'variant-picker__option variant-picker__option--selected'
                : 'variant-picker__option'

              if (isSelected || !pageToken) {
                return (
                  <span key={option.name} className={className} aria-current={isSelected || undefined}>
                    {option.name}
                  </span>
                )
              }

              return (
                <Link key={option.name} to={productPath(pageToken, query)} className={className}>
                  {option.name}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
