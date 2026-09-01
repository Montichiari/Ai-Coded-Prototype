import { Link } from 'react-router-dom'
import type { Entry } from '../types'
import { formatDate, previewText } from '../format'

export default function EntryTile({ entry }: { entry: Entry }) {
  const preview = previewText(entry.body)

  return (
    <Link to={`/entries/${entry.id}`} className="tile">
      <time className="tile-date" dateTime={entry.entry_date}>
        {formatDate(entry.entry_date)}
      </time>
      <h2 className="tile-title" title={entry.title}>
        {entry.title}
      </h2>
      {preview && <p className="tile-preview">{preview}</p>}
    </Link>
  )
}
