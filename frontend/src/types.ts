export interface Entry {
  id: number
  entry_date: string // ISO date, yyyy-mm-dd
  title: string
  body: string
}

export interface EntryInput {
  entry_date: string
  title: string
  body: string
}
