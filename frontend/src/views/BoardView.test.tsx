import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createDummyBoard } from '../data/dummyBoard'
import { BoardProvider } from '../viewmodels/BoardContext'
import { BoardViewModel } from '../viewmodels/BoardViewModel'
import { BoardView, handleDragEnd } from './BoardView'
import type { DragEndEvent } from '@dnd-kit/core'

function dragEvent(activeId: string, overId: string | null): DragEndEvent {
  return {
    active: { id: activeId },
    over: overId ? { id: overId } : null,
  } as DragEndEvent
}

describe('BoardView', () => {
  it('renders dummy columns', () => {
    render(
      <BoardProvider>
        <BoardView />
      </BoardProvider>,
    )
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('column-title-col-backlog')).toHaveTextContent('Backlog')
    expect(screen.getByTestId('column-title-col-done')).toHaveTextContent('Done')
  })
})

describe('handleDragEnd', () => {
  it('returns when there is no drop target', () => {
    const vm = new BoardViewModel(createDummyBoard())
    handleDragEnd(vm, dragEvent('card-brand', null))
    expect(vm.getSnapshot().columns[0].cards[0].id).toBe('card-brand')
  })

  it('returns when dropping on the same card', () => {
    const vm = new BoardViewModel(createDummyBoard())
    handleDragEnd(vm, dragEvent('card-brand', 'card-brand'))
    expect(vm.getSnapshot().columns[0].cards[0].id).toBe('card-brand')
  })

  it('returns when the target is unknown', () => {
    const vm = new BoardViewModel(createDummyBoard())
    handleDragEnd(vm, dragEvent('card-brand', 'missing'))
    expect(vm.getSnapshot().columns[0].cards[0].id).toBe('card-brand')
  })

  it('moves a card onto a column', () => {
    const vm = new BoardViewModel(createDummyBoard())
    handleDragEnd(vm, dragEvent('card-brand', 'col-done'))
    expect(vm.getSnapshot().columns[4].cards.map((card) => card.id)).toContain('card-brand')
  })

  it('moves a card onto another card', () => {
    const vm = new BoardViewModel(createDummyBoard())
    handleDragEnd(vm, dragEvent('card-brand', 'card-palette'))
    expect(vm.getSnapshot().columns[4].cards[0].id).toBe('card-brand')
  })
})
