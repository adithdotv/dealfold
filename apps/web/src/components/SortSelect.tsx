import './SortSelect.css'

interface SortOption<T extends string> {
  value: T
  label: string
}

interface SortSelectProps<T extends string> {
  value: T
  options: SortOption<T>[]
  onChange: (value: T) => void
}

export function SortSelect<T extends string>({ value, options, onChange }: SortSelectProps<T>) {
  function handleChange(selectedValue: string) {
    const selectedOption = options.find((option) => option.value === selectedValue)
    if (selectedOption) onChange(selectedOption.value)
  }

  return (
    <label className="sort-select">
      <span className="text-caption text-secondary">Sort by</span>
      <select value={value} onChange={(event) => handleChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
