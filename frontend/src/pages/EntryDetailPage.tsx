import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Entry } from '../types'
import { deleteEntry, getEntry } from '../api'
import { formatDate } from '../format'

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEntry(Number(id))
      .then(setEntry)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load entry'),
      )
  }, [id])

  async function handleDelete() {
    if (!entry) return
    if (!window.confirm('Delete this entry? This cannot be undone.')) return
    try {
      await deleteEntry(entry.id)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry')
    }
  }

  if (error) {
    return (
      <section>
        <p className="form-error">{error}</p>
        <Link to="/" className="back-link">
          ← Back to entries
        </Link>
      </section>
    )
  }

  if (!entry) return <p className="muted">Loading…</p>

  return (
    <section className="entry-detail">
      <Link to="/" className="back-link">
        ← Back to entries
      </Link>

      <time className="detail-date" dateTime={entry.entry_date}>
        {formatDate(entry.entry_date)}
      </time>
      <h1>{entry.title}</h1>

      {entry.body ? (
        <p className="detail-body">{entry.body}</p>
      ) : (
        <p className="muted">No body text.</p>
      )}

      <div className="form-actions">
        <Link to={`/entries/${entry.id}/edit`} className="button">
          Edit
        </Link>
        <button type="button" className="danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </section>
  )
}
