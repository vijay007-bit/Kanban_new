import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState, type KeyboardEvent } from 'react'
import type { Column } from '../models/types'
import { useBoardViewModel } from '../viewmodels/BoardContext'
import { AddCardForm } from './AddCardForm'
import { CardView } from './CardView'

export function ColumnView({ column }: { column: Column }) {
  const vm = useBoardViewModel()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  function commitRename() {
    const next = title.trim()
    if (next) vm.renameColumn(column.id, next)
    else setTitle(column.title)
    setEditing(false)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commitRename()
    if (event.key === 'Escape') {
      setTitle(column.title)
      setEditing(false)
    }
  }

  return (
    <section
      ref={setNodeRef}
      className={`column${isOver ? ' is-over' : ''}`}
      data-testid={`column-${column.id}`}
    >
      <header className="column-header">
        {editing ? (
          <input
            className="column-title-input"
            aria-label="Column title"
            data-testid={`column-title-input-${column.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={commitRename}
            onKeyDown={onKeyDown}
            autoFocus
          />
        ) : (
          <h2>
            <button
              type="button"
              className="column-title"
              data-testid={`column-title-${column.id}`}
              onClick={() => {
                setTitle(column.title)
                setEditing(true)
              }}
            >
              {column.title}
            </button>
          </h2>
        )}
        <span className="column-count">{column.cards.length}</span>
      </header>
      <div className="column-list">
        <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <CardView key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
      <AddCardForm columnId={column.id} />
    </section>
  )
}
