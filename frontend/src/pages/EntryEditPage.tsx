import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Entry, EntryInput } from '../types'
import { getEntry, updateEntry } from '../api'
import EntryForm from '../components/EntryForm'

export default function EntryEditPage() {
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

  async function handleSubmit(input: EntryInput) {
    if (!entry) return
    await updateEntry(entry.id, input)
    navigate(`/entries/${entry.id}`)
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
    <section>
      <h1>Edit entry</h1>
      <EntryForm
        initial={entry}
        submitLabel="Save"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/entries/${entry.id}`)}
      />
    </section>
  )
}
