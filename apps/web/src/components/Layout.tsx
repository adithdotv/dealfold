import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import bellIcon from '../assets/icons/bell.svg'
import userIcon from '../assets/icons/user.svg'
import { SearchBar } from './SearchBar'
import './Layout.css'

// Sections from the design that are not part of P0 yet.
const UPCOMING_SECTIONS = ['Categories', 'Price Drops', 'Watchlist']

export function Layout() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const isCompareActive = pathname !== '/'

  return (
    <div className="layout">
      <header className="nav">
        <Link to="/" className="nav__logo">
          Dealfold
        </Link>
        <nav className="nav__links">
          <Link to="/" className={isCompareActive ? 'nav__link nav__link--active' : 'nav__link'}>
            Compare
          </Link>
          {UPCOMING_SECTIONS.map((section) => (
            <span key={section} className="nav__link nav__link--upcoming" title="Coming soon">
              {section}
            </span>
          ))}
        </nav>
        <div className="nav__spacer" />
        <SearchBar key={query} initialQuery={query} compact />
        <button type="button" className="nav__icon-button" aria-label="Notifications" disabled>
          <img src={bellIcon} width={20} height={20} alt="" />
        </button>
        <button type="button" className="nav__profile" aria-label="Profile" disabled>
          <img src={userIcon} width={16} height={16} alt="" />
        </button>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="page">
        <div className="footer">
          <span className="text-body-medium">Dealfold</span>
          <span className="text-caption text-muted">
            Prices are indicative. You complete your purchase on the retailer site.
          </span>
        </div>
      </footer>
    </div>
  )
}
