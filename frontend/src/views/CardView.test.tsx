import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createDummyBoard } from '../data/dummyBoard'
import { BoardProvider, useBoard } from '../viewmodels/BoardContext'
import { CardView } from './CardView'

const card = createDummyBoard().columns[0].cards[0]

function CardProbe() {
  const board = useBoard()
  const live = board.columns.flatMap((column) => column.cards).find((item) => item.id === card.id)
  if (!live) return <p>gone</p>
  return (
    <DndContext>
      <SortableContext items={[live.id]}>
        <CardView card={live} />
      </SortableContext>
    </DndContext>
  )
}

function renderCard() {
  return render(
    <BoardProvider>
      <CardProbe />
    </BoardProvider>,
  )
}

describe('CardView', () => {
  it('edits title and details', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const title = screen.getByLabelText('Edit title')
    await user.clear(title)
    await user.type(title, 'Brand kit')
    const details = screen.getByLabelText('Edit details')
    await user.clear(details)
    await user.type(details, 'New tokens')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByText('Brand kit')).toBeInTheDocument()
    expect(screen.getByText('New tokens')).toBeInTheDocument()
  })

  it('does not save a blank title', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByLabelText('Edit title'))
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByLabelText('Edit title')).toBeInTheDocument()
  })

  it('cancels edit', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByLabelText('Edit title'))
    await user.type(screen.getByLabelText('Edit title'), 'Temp')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Refresh brand guidelines')).toBeInTheDocument()
  })

  it('deletes the card', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByTestId(`delete-${card.id}`))
    expect(screen.getByText('gone')).toBeInTheDocument()
  })
})
