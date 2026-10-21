import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { TrashZone } from './TrashZone'
import styles from './TrashZone.module.css'

describe('TrashZone', () => {
  it('renders default state without over class', () => {
    render(<TrashZone isOver={false} />)

    const element = screen.getByTestId('trash-zone')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Drop to delete')
    expect(element).not.toHaveClass(styles.trashZoneOver)
  })

  it('renders highlighted over state when isOver is true', () => {
    render(<TrashZone isOver={true} />)

    const element = screen.getByTestId('trash-zone')
    expect(element).toHaveClass(styles.trashZoneOver)
  })

  it('forwards ref to the container DOM element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<TrashZone ref={ref} isOver={false} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-testid', 'trash-zone')
  })
})
