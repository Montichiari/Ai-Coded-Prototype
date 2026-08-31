import { useNavigate } from 'react-router-dom'
import type { EntryInput } from '../types'
import { createEntry } from '../api'
import EntryForm from '../components/EntryForm'

export default function EntryNewPage() {
  const navigate = useNavigate()

  async function handleSubmit(input: EntryInput) {
    const created = await createEntry(input)
    navigate(`/entries/${created.id}`)
  }

  return (
    <section>
      <h1>New entry</h1>
      <EntryForm
        submitLabel="Create"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </section>
  )
}
