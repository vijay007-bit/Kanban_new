import { useState, type FormEvent } from 'react'
import { useBoardViewModel } from '../viewmodels/BoardContext'

export function AddCardForm({ columnId }: { columnId: string }) {
  const vm = useBoardViewModel()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')

  function reset() {
    setTitle('')
    setDetails('')
    setOpen(false)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return
    vm.addCard(columnId, nextTitle, details.trim())
    reset()
  }

  if (!open) {
    return (
      <button
        type="button"
        className="add-toggle"
        data-testid={`add-toggle-${columnId}`}
        onClick={() => setOpen(true)}
      >
        Add card
      </button>
    )
  }

  return (
    <form className="add-form" data-testid={`add-form-${columnId}`} onSubmit={onSubmit}>
      <input
        aria-label="Card title"
        data-testid={`add-title-${columnId}`}
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        autoFocus
      />
      <textarea
        aria-label="Card details"
        data-testid={`add-details-${columnId}`}
        placeholder="Details"
        rows={3}
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" data-testid={`add-submit-${columnId}`}>
          Add
        </button>
        <button type="button" className="btn-ghost" onClick={reset}>
          Cancel
        </button>
      </div>
    </form>
  )
}
