import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { createDummyBoard } from '../data/dummyBoard'
import type { Board } from '../models/types'
import { BoardViewModel } from './BoardViewModel'

const BoardVmContext = createContext<BoardViewModel | null>(null)

export function BoardProvider({ children }: { children: ReactNode }) {
  const vm = useMemo(() => new BoardViewModel(createDummyBoard()), [])
  return <BoardVmContext.Provider value={vm}>{children}</BoardVmContext.Provider>
}

export function useBoardViewModel(): BoardViewModel {
  return useContext(BoardVmContext)!
}

export function useBoard(): Board {
  const vm = useBoardViewModel()
  return useSyncExternalStore(vm.subscribe, vm.getSnapshot)
}
