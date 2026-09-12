import { BoardProvider } from './viewmodels/BoardContext'
import { BoardView } from './views/BoardView'

function App() {
  return (
    <BoardProvider>
      <BoardView />
    </BoardProvider>
  )
}

export default App
