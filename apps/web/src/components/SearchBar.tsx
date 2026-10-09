import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import searchIcon from '../assets/icons/search-20.svg'
import searchIconSmall from '../assets/icons/search-16.svg'
import { searchPath } from '../utils/routes'
import { buttonClassName } from './buttonClassName'
import './SearchBar.css'

const PLACEHOLDER = 'Search for a product...'

interface SearchBarProps {
  initialQuery?: string
  compact?: boolean
}

export function SearchBar({ initialQuery = '', compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    navigate(searchPath(trimmedQuery))
  }

  if (compact) {
    return (
      <form className="search-bar search-bar--compact" role="search" onSubmit={handleSubmit}>
        <img src={searchIconSmall} width={16} height={16} alt="" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Search for a product"
        />
      </form>
    )
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label className="search-bar__field">
        <img src={searchIcon} width={20} height={20} alt="" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Search for a product"
        />
      </label>
      <button type="submit" className={buttonClassName('primary', { large: true })}>
        Search
      </button>
    </form>
  )
}
