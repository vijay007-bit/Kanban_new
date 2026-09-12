import { describe, expect, it } from 'vitest'
import { createDummyBoard } from '../data/dummyBoard'
import { BoardViewModel } from './BoardViewModel'

function vm() {
  return new BoardViewModel(createDummyBoard())
}

describe('BoardViewModel', () => {
  it('starts with five dummy columns', () => {
    const board = vm().getSnapshot()
    expect(board.columns).toHaveLength(5)
    expect(board.columns.map((column) => column.title)).toEqual([
      'Backlog',
      'Ready',
      'In Progress',
      'Review',
      'Done',
    ])
  })

  it('notifies subscribers and allows unsubscribe', () => {
    const board = vm()
    let calls = 0
    const unsubscribe = board.subscribe(() => {
      calls += 1
    })
    board.renameColumn('col-backlog', 'Icebox')
    expect(calls).toBe(1)
    unsubscribe()
    board.renameColumn('col-backlog', 'Parking')
    expect(calls).toBe(1)
    expect(board.getSnapshot().columns[0].title).toBe('Parking')
  })

  it('renames a column', () => {
    const board = vm()
    board.renameColumn('col-backlog', 'Icebox')
    expect(board.getSnapshot().columns[0].title).toBe('Icebox')
  })

  it('ignores rename for an unknown column', () => {
    const board = vm()
    board.renameColumn('missing', 'Nope')
    expect(board.getSnapshot().columns[0].title).toBe('Backlog')
  })

  it('adds a card to a column', () => {
    const board = vm()
    const added = board.addCard('col-ready', 'Write changelog', 'Summarize the sprint.')
    expect(added?.title).toBe('Write changelog')
    const ready = board.getSnapshot().columns.find((column) => column.id === 'col-ready')
    expect(ready?.cards.map((card) => card.title)).toContain('Write changelog')
  })

  it('ignores add for an unknown column', () => {
    const board = vm()
    expect(board.addCard('missing', 'Ghost', '')).toBeUndefined()
  })

  it('deletes a card', () => {
    const board = vm()
    board.deleteCard('card-brand')
    const backlog = board.getSnapshot().columns.find((column) => column.id === 'col-backlog')
    expect(backlog?.cards.some((card) => card.id === 'card-brand')).toBe(false)
  })

  it('ignores delete for an unknown card', () => {
    const board = vm()
    const before = board.getSnapshot().columns.reduce((sum, column) => sum + column.cards.length, 0)
    board.deleteCard('missing')
    const after = board.getSnapshot().columns.reduce((sum, column) => sum + column.cards.length, 0)
    expect(after).toBe(before)
  })

  it('moves a card within a column', () => {
    const board = vm()
    board.moveCard('card-brand', 'col-backlog', 2)
    const ids = board.getSnapshot().columns[0].cards.map((card) => card.id)
    expect(ids).toEqual(['card-onboard', 'card-brand'])
  })

  it('clamps a move index to the destination length', () => {
    const board = vm()
    board.moveCard('card-brand', 'col-done', 99)
    const done = board.getSnapshot().columns.find((column) => column.id === 'col-done')
    expect(done?.cards[done.cards.length - 1].id).toBe('card-brand')
  })

  it('moves a card across columns', () => {
    const board = vm()
    board.moveCard('card-brand', 'col-done', 0)
    const snapshot = board.getSnapshot()
    const backlog = snapshot.columns.find((column) => column.id === 'col-backlog')
    const done = snapshot.columns.find((column) => column.id === 'col-done')
    expect(backlog?.cards.some((card) => card.id === 'card-brand')).toBe(false)
    expect(done?.cards[0].id).toBe('card-brand')
  })

  it('ignores move for an unknown card or column', () => {
    const board = vm()
    board.moveCard('missing', 'col-done', 0)
    board.moveCard('card-brand', 'missing', 0)
    expect(board.getSnapshot().columns[0].cards[0].id).toBe('card-brand')
  })

  it('updates card title and details', () => {
    const board = vm()
    board.updateCard('card-api', 'Billing API v2', 'Include refunds.')
    const ready = board.getSnapshot().columns.find((column) => column.id === 'col-ready')
    expect(ready?.cards[0]).toMatchObject({
      title: 'Billing API v2',
      details: 'Include refunds.',
    })
  })

  it('ignores update for an unknown card', () => {
    const board = vm()
    board.updateCard('missing', 'X', 'Y')
    expect(board.getSnapshot().columns[1].cards[0].title).toBe('Specify billing API')
  })
})
