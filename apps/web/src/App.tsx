import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ComparePage } from './pages/compare/ComparePage'
import { HomePage } from './pages/home/HomePage'
import { ProductPage } from './pages/product/ProductPage'
import { SearchResultsPage } from './pages/search/SearchResultsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="product/compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
