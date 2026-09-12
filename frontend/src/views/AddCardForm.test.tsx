import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { BoardProvider, useBoard } from '../viewmodels/BoardContext'
import { AddCardForm } from './AddCardForm'

function ReadyCards() {
  const board = useBoard()
  const ready = board.columns.find((column) => column.id === 'col-ready')
  return (
    <div>
      {ready?.cards.map((card) => (
        <p key={card.id}>{card.title}</p>
      ))}
      <AddCardForm columnId="col-ready" />
    </div>
  )
}

function renderForm() {
  return render(
    <BoardProvider>
      <DndContext>
        <SortableContext items={[]}>
          <ReadyCards />
        </SortableContext>
      </DndContext>
    </BoardProvider>,
  )
}

describe('AddCardForm', () => {
  it('adds a card and closes the form', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByTestId('add-toggle-col-ready'))
    await user.type(screen.getByTestId('add-title-col-ready'), 'Ship notes')
    await user.type(screen.getByTestId('add-details-col-ready'), 'Friday')
    await user.click(screen.getByTestId('add-submit-col-ready'))
    expect(screen.getByText('Ship notes')).toBeInTheDocument()
    expect(screen.getByTestId('add-toggle-col-ready')).toBeInTheDocument()
  })

  it('does not add a card without a title', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByTestId('add-toggle-col-ready'))
    await user.click(screen.getByTestId('add-submit-col-ready'))
    expect(screen.getByTestId('add-form-col-ready')).toBeInTheDocument()
  })

  it('cancels the form', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByTestId('add-toggle-col-ready'))
    await user.type(screen.getByTestId('add-title-col-ready'), 'Nope')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByTestId('add-toggle-col-ready')).toBeInTheDocument()
    expect(screen.queryByText('Nope')).not.toBeInTheDocument()
  })
})
