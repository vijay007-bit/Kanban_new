import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useBoard, useBoardViewModel } from '../viewmodels/BoardContext'
import type { BoardViewModel } from '../viewmodels/BoardViewModel'
import { ColumnView } from './ColumnView'

export function handleDragEnd(vm: BoardViewModel, event: DragEndEvent) {
  const { active, over } = event
  if (!over || active.id === over.id) return

  const cardId = String(active.id)
  const overId = String(over.id)
  const snapshot = vm.getSnapshot()
  const overColumn =
    snapshot.columns.find((column) => column.id === overId) ??
    snapshot.columns.find((column) => column.cards.some((card) => card.id === overId))
  if (!overColumn) return

  const toIndex =
    overColumn.id === overId
      ? overColumn.cards.length
      : overColumn.cards.findIndex((card) => card.id === overId)

  vm.moveCard(cardId, overColumn.id, toIndex)
}

export function BoardView() {
  const board = useBoard()
  const vm = useBoardViewModel()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Workspace</p>
        <h1>Product Kanban</h1>
        <p className="lede">One board. Five columns. Move work with a drag.</p>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={(event) => handleDragEnd(vm, event)}
      >
        <div className="board" data-testid="board">
          {board.columns.map((column) => (
            <ColumnView key={column.id} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  )
}
