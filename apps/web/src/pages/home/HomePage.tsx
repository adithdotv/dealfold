import { Link } from 'react-router-dom'
import { SearchBar } from '../../components/SearchBar'
import { searchPath } from '../../utils/routes'
import './HomePage.css'

const EXAMPLE_QUERIES = ['Apple iPhone 17', 'Sony WH-1000XM5', 'MacBook Air', 'Samsung TV']

const STEPS = [
  {
    title: 'Match the exact product',
    description:
      'We group retailer listings under one product and variant, so you compare like with like.',
  },
  {
    title: 'See the true price',
    description:
      'Product price, delivery, coupons and bank offers are shown separately, ending in one final price.',
  },
  {
    title: 'Know why it wins',
    description:
      'Every lowest price comes with a plain explanation and the conditions behind it.',
  },
]

export function HomePage() {
  return (
    <div className="page">
      <section className="home-hero">
        <h1 className="text-display">Search once. Compare everywhere. Pay less.</h1>
        <p className="text-body-large text-secondary">
          Find the exact product, then see the lowest total price across stores.
        </p>
        <div className="home-hero__search">
          <SearchBar />
        </div>
        <div className="home-hero__examples">
          <span className="text-caption text-secondary">Try</span>
          {EXAMPLE_QUERIES.map((example) => (
            <Link
              key={example}
              to={searchPath(example)}
              className="home-hero__chip"
            >
              {example}
            </Link>
          ))}
        </div>
      </section>

      <section className="home-steps">
        <h2 className="text-h3">How Dealfold works</h2>
        <ol className="home-steps__list">
          {STEPS.map((step, index) => (
            <li key={step.title} className="home-steps__item">
              <span className="text-body-medium home-steps__number">{index + 1}</span>
              <h3 className="text-h4">{step.title}</h3>
              <p className="text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
