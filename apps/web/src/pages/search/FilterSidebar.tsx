import type { ReactNode } from 'react'
import { EMPTY_FILTERS, type SearchFilters } from './searchFilters'
import './FilterSidebar.css'

const DISCOUNT_OPTIONS = [10, 20]
const GOOD_RATING = 4

interface FilterSidebarProps {
  filters: SearchFilters
  storeOptions: string[]
  onChange: (filters: SearchFilters) => void
}

export function FilterSidebar({ filters, storeOptions, onChange }: FilterSidebarProps) {
  function toggleStore(store: string) {
    const stores = filters.stores.includes(store)
      ? filters.stores.filter((selectedStore) => selectedStore !== store)
      : [...filters.stores, store]
    onChange({ ...filters, stores })
  }

  function toggleDiscount(percent: number) {
    const minimumDiscountPercent = filters.minimumDiscountPercent === percent ? 0 : percent
    onChange({ ...filters, minimumDiscountPercent })
  }

  return (
    <aside className="filter-sidebar card">
      <div className="filter-sidebar__header">
        <h2 className="text-h4">Filters</h2>
        <button type="button" className="text-link filter-sidebar__clear" onClick={() => onChange(EMPTY_FILTERS)}>
          Clear all
        </button>
      </div>

      {storeOptions.length > 0 && (
        <FilterGroup title="Store">
          {storeOptions.map((store) => (
            <FilterCheckbox
              key={store}
              label={store}
              checked={filters.stores.includes(store)}
              onChange={() => toggleStore(store)}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Delivery">
        <FilterCheckbox
          label="Free delivery"
          checked={filters.freeDeliveryOnly}
          onChange={() => onChange({ ...filters, freeDeliveryOnly: !filters.freeDeliveryOnly })}
        />
      </FilterGroup>

      <FilterGroup title="Discount">
        {DISCOUNT_OPTIONS.map((percent) => (
          <FilterCheckbox
            key={percent}
            label={`${percent}% or more`}
            checked={filters.minimumDiscountPercent === percent}
            onChange={() => toggleDiscount(percent)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating">
        <FilterCheckbox
          label={`${GOOD_RATING} stars and up`}
          checked={filters.minimumRating === GOOD_RATING}
          onChange={() =>
            onChange({ ...filters, minimumRating: filters.minimumRating ? 0 : GOOD_RATING })
          }
        />
      </FilterGroup>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="filter-sidebar__group">
      <legend className="text-body-medium">{title}</legend>
      {children}
    </fieldset>
  )
}

interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
}

function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="filter-sidebar__option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}
