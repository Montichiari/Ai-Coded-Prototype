import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Entry } from '../types'
import { listEntries } from '../api'
import EntryTile from '../components/EntryTile'

export default function EntryListPage() {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listEntries()
      .then(setEntries)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load entries'),
      )
  }, [])

  return (
    <section>
      <div className="page-head">
        <h1>Entries</h1>
        <Link to="/entries/new" className="button">
          New entry
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}
      {!error && entries === null && <p className="muted">Loading…</p>}
      {!error && entries !== null && entries.length === 0 && (
        <p className="muted">No entries yet. Create your first one.</p>
      )}

      {entries && entries.length > 0 && (
        <div className="tile-grid">
          {entries.map((entry) => (
            <EntryTile key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  )
}
