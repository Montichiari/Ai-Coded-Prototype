import { Link, Route, Routes } from 'react-router-dom'
import EntryListPage from './pages/EntryListPage'
import EntryNewPage from './pages/EntryNewPage'
import EntryDetailPage from './pages/EntryDetailPage'
import EntryEditPage from './pages/EntryEditPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title">
          Journal
        </Link>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<EntryListPage />} />
          <Route path="/entries/new" element={<EntryNewPage />} />
          <Route path="/entries/:id" element={<EntryDetailPage />} />
          <Route path="/entries/:id/edit" element={<EntryEditPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
