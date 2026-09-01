import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Entry, EntryInput } from '../types'
import { todayISO } from '../format'

interface Props {
  initial?: Entry
  submitLabel: string
  onSubmit: (input: EntryInput) => Promise<void>
  onCancel: () => void
}

export default function EntryForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [entryDate, setEntryDate] = useState(initial?.entry_date ?? todayISO())
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const titleValid = title.trim().length > 0

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!titleValid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ entry_date: entryDate, title: title.trim(), body })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <label>
        <span>Date</span>
        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          required
        />
      </label>

      <label>
        <span>Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A short title for this entry"
          autoFocus
        />
        {!titleValid && <small className="hint">A title is required.</small>}
      </label>

      <label>
        <span>Body</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          placeholder="Write as much or as little as you like…"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={!titleValid || submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
