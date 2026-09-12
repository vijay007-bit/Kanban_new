import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, type FormEvent } from 'react'
import type { Card } from '../models/types'
import { useBoardViewModel } from '../viewmodels/BoardContext'

export function CardView({ card }: { card: Card }) {
  const vm = useBoardViewModel()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [details, setDetails] = useState(card.details)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function startEdit() {
    setTitle(card.title)
    setDetails(card.details)
    setEditing(true)
  }

  function onSave(event: FormEvent) {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return
    vm.updateCard(card.id, nextTitle, details.trim())
    setEditing(false)
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`card${isDragging ? ' is-dragging' : ''}`}
      data-testid={card.id}
    >
      {editing ? (
        <form className="card-edit" onSubmit={onSave}>
          <input
            aria-label="Edit title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
          <textarea
            aria-label="Edit details"
            rows={3}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          />
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="card-body" {...attributes} {...listeners}>
            <h3>{card.title}</h3>
            <p>{card.details}</p>
          </div>
          <div className="card-actions">
            <button type="button" className="btn-link" onClick={startEdit}>
              Edit
            </button>
            <button
              type="button"
              className="btn-link danger"
              data-testid={`delete-${card.id}`}
              onClick={() => vm.deleteCard(card.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  )
}
