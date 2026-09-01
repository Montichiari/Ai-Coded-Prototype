import type { Entry, EntryInput } from './types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (typeof data?.detail === 'string') detail = data.detail
    } catch {
      // response had no JSON body; keep the generic message
    }
    throw new Error(detail)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export function listEntries(): Promise<Entry[]> {
  return request<Entry[]>('/entries')
}

export function getEntry(id: number): Promise<Entry> {
  return request<Entry>(`/entries/${id}`)
}

export function createEntry(input: EntryInput): Promise<Entry> {
  return request<Entry>('/entries', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateEntry(id: number, input: EntryInput): Promise<Entry> {
  return request<Entry>(`/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteEntry(id: number): Promise<void> {
  return request<void>(`/entries/${id}`, { method: 'DELETE' })
}
