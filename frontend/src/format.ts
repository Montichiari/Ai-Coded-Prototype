export const PREVIEW_LENGTH = 140

/** Today's date as an ISO yyyy-mm-dd string, in the local timezone. */
export function todayISO(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

/** Render an ISO date (yyyy-mm-dd) as a readable local date. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Truncate to PREVIEW_LENGTH, adding an ellipsis only when text was cut. */
export function previewText(body: string): string {
  if (body.length <= PREVIEW_LENGTH) return body
  return `${body.slice(0, PREVIEW_LENGTH).trimEnd()}…`
}
