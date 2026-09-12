import { createRoot } from 'react-dom/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const render = vi.fn()

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({ render })),
}))

describe('main', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    render.mockClear()
  })

  it('mounts the app on #root', async () => {
    await import('./main.tsx')
    expect(createRoot).toHaveBeenCalled()
    expect(render).toHaveBeenCalled()
  })
})
