import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the kanban board', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Product Kanban' })).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })
})
