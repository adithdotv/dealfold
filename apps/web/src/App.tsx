import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/home/HomePage'
import { SearchResultsPage } from './pages/search/SearchResultsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchResultsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
