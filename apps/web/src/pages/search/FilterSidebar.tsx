import { useId, useState, type ReactNode } from 'react'
import chevronIcon from '../../assets/icons/chevron-down.svg'
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
  // Only applies on small screens, where the sidebar starts collapsed above the results.
  const [isOpen, setIsOpen] = useState(false)
  const groupsId = useId()
  const activeCount = activeFilterCount(filters)

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
    <aside className={isOpen ? 'filter-sidebar filter-sidebar--open card' : 'filter-sidebar card'}>
      <div className="filter-sidebar__header">
        <h2 className="text-h4 filter-sidebar__title">Filters</h2>
        <button
          type="button"
          className="filter-sidebar__toggle"
          aria-expanded={isOpen}
          aria-controls={groupsId}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-h4">Filters</span>
          {activeCount > 0 && <span className="filter-sidebar__count">{activeCount}</span>}
          <img src={chevronIcon} width={16} height={16} alt="" className="filter-sidebar__chevron" />
        </button>
        <button type="button" className="text-link filter-sidebar__clear" onClick={() => onChange(EMPTY_FILTERS)}>
          Clear all
        </button>
      </div>

      <div id={groupsId} className="filter-sidebar__groups">
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
      </div>
    </aside>
  )
}

function activeFilterCount(filters: SearchFilters): number {
  return (
    filters.stores.length +
    Number(filters.freeDeliveryOnly) +
    Number(filters.minimumDiscountPercent > 0) +
    Number(filters.minimumRating > 0)
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
