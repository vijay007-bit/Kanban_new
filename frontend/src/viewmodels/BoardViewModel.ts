import type { Board, Card } from '../models/types'

function cloneBoard(board: Board): Board {
  return {
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({ ...card })),
    })),
  }
}

export class BoardViewModel {
  private board: Board
  private listeners = new Set<() => void>()

  constructor(initial: Board) {
    this.board = cloneBoard(initial)
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.board

  private emit() {
    this.board = cloneBoard(this.board)
    this.listeners.forEach((listener) => listener())
  }

  renameColumn(columnId: string, title: string) {
    const column = this.board.columns.find((item) => item.id === columnId)
    if (!column) return
    column.title = title
    this.emit()
  }

  addCard(columnId: string, title: string, details: string) {
    const column = this.board.columns.find((item) => item.id === columnId)
    if (!column) return
    const card: Card = { id: crypto.randomUUID(), title, details }
    column.cards.push(card)
    this.emit()
    return card
  }

  updateCard(cardId: string, title: string, details: string) {
    for (const column of this.board.columns) {
      const card = column.cards.find((item) => item.id === cardId)
      if (card) {
        card.title = title
        card.details = details
        this.emit()
        return
      }
    }
  }

  deleteCard(cardId: string) {
    for (const column of this.board.columns) {
      const index = column.cards.findIndex((item) => item.id === cardId)
      if (index !== -1) {
        column.cards.splice(index, 1)
        this.emit()
        return
      }
    }
  }

  moveCard(cardId: string, toColumnId: string, toIndex: number) {
    const fromColumn = this.board.columns.find((column) =>
      column.cards.some((card) => card.id === cardId),
    )
    const destColumn = this.board.columns.find((column) => column.id === toColumnId)
    if (!fromColumn || !destColumn) return

    const fromIndex = fromColumn.cards.findIndex((card) => card.id === cardId)
    const [card] = fromColumn.cards.splice(fromIndex, 1)
    let index = toIndex
    if (fromColumn.id === destColumn.id && fromIndex < toIndex) {
      index -= 1
    }
    index = Math.max(0, Math.min(index, destColumn.cards.length))
    destColumn.cards.splice(index, 0, card)
    this.emit()
  }
}
