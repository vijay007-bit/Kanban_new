import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BoardProvider, useBoard, useBoardViewModel } from './BoardContext'

function Probe() {
  const board = useBoard()
  const vm = useBoardViewModel()
  return (
    <div>
      <span data-testid="count">{board.columns.length}</span>
      <button type="button" onClick={() => vm.renameColumn('col-backlog', 'Icebox')}>
        Rename
      </button>
      <span data-testid="first">{board.columns[0].title}</span>
    </div>
  )
}

describe('BoardContext', () => {
  it('provides the dummy board and updates after view-model changes', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    render(
      <BoardProvider>
        <Probe />
      </BoardProvider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('5')
    expect(screen.getByTestId('first')).toHaveTextContent('Backlog')
    await user.click(screen.getByRole('button', { name: 'Rename' }))
    expect(screen.getByTestId('first')).toHaveTextContent('Icebox')
  })
})
