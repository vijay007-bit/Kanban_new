import { describe, expect, it } from 'vitest'
import { createDummyBoard } from './dummyBoard'

describe('createDummyBoard', () => {
  it('returns five columns with sample cards', () => {
    const board = createDummyBoard()
    expect(board.columns).toHaveLength(5)
    expect(board.columns.every((column) => column.cards.length > 0)).toBe(true)
  })
})
