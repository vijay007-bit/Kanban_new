import { DndContext } from '@dnd-kit/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createDummyBoard } from '../data/dummyBoard'
import { BoardProvider, useBoard } from '../viewmodels/BoardContext'
import { ColumnView } from './ColumnView'

function BacklogColumn() {
  const board = useBoard()
  const column = board.columns.find((item) => item.id === 'col-backlog')!
  return (
    <DndContext>
      <ColumnView column={column} />
    </DndContext>
  )
}

function renderColumn() {
  return render(
    <BoardProvider>
      <BacklogColumn />
    </BoardProvider>,
  )
}

describe('ColumnView', () => {
  it('renames a column on Enter', async () => {
    const user = userEvent.setup()
    renderColumn()
    await user.click(screen.getByTestId('column-title-col-backlog'))
    const input = screen.getByTestId('column-title-input-col-backlog')
    await user.clear(input)
    await user.type(input, 'Icebox{Enter}')
    expect(screen.getByTestId('column-title-col-backlog')).toHaveTextContent('Icebox')
  })

  it('restores the title on Escape', async () => {
    const user = userEvent.setup()
    const original = createDummyBoard().columns[0].title
    renderColumn()
    await user.click(screen.getByTestId('column-title-col-backlog'))
    const input = screen.getByTestId('column-title-input-col-backlog')
    await user.clear(input)
    await user.type(input, 'Temp{Escape}')
    expect(screen.getByTestId('column-title-col-backlog')).toHaveTextContent(original)
  })

  it('restores the title when the rename is blank', async () => {
    const user = userEvent.setup()
    renderColumn()
    await user.click(screen.getByTestId('column-title-col-backlog'))
    const input = screen.getByTestId('column-title-input-col-backlog')
    await user.clear(input)
    await user.tab()
    expect(screen.getByTestId('column-title-col-backlog')).toHaveTextContent('Backlog')
  })

  it('commits rename on blur', async () => {
    const user = userEvent.setup()
    renderColumn()
    await user.click(screen.getByTestId('column-title-col-backlog'))
    const input = screen.getByTestId('column-title-input-col-backlog')
    await user.clear(input)
    await user.type(input, 'Later')
    await user.tab()
    expect(screen.getByTestId('column-title-col-backlog')).toHaveTextContent('Later')
  })
})
