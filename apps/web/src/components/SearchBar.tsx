import { useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import searchIcon from '../assets/icons/search-20.svg'
import searchIconDark from '../assets/icons/search-20-dark.svg'
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
    return <ExpandableSearchForm query={query} onQueryChange={setQuery} onSubmit={handleSubmit} />
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

interface ExpandableSearchFormProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

// Shown as an icon until opened; collapses again on Escape or when focus leaves it.
function ExpandableSearchForm({ query, onQueryChange, onSubmit }: ExpandableSearchFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function expand() {
    // The input is hidden while collapsed, so it must be visible before it can take focus.
    flushSync(() => setIsExpanded(true))
    inputRef.current?.focus()
  }

  // Clicking the icon or padding would otherwise blur the input and collapse the bar.
  function keepInputFocus(event: MouseEvent<HTMLFormElement>) {
    if (event.target !== inputRef.current) event.preventDefault()
  }

  function collapseOnFocusLeave(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsExpanded(false)
  }

  function collapseOnEscape(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Escape') return
    setIsExpanded(false)
    toggleRef.current?.focus()
  }

  return (
    <form
      className={isExpanded ? 'search-bar search-bar--compact search-bar--expanded' : 'search-bar search-bar--compact'}
      role="search"
      onSubmit={onSubmit}
      onMouseDown={keepInputFocus}
      onBlur={collapseOnFocusLeave}
      onKeyDown={collapseOnEscape}
    >
      <button
        ref={toggleRef}
        type="button"
        className="search-bar__toggle"
        aria-label="Open search"
        aria-expanded={isExpanded}
        tabIndex={isExpanded ? -1 : undefined}
        onClick={expand}
      >
        <img src={searchIconDark} width={20} height={20} alt="" />
      </button>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={PLACEHOLDER}
        aria-label="Search for a product"
      />
    </form>
  )
}
