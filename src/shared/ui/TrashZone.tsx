import { forwardRef } from 'react'
import styles from './TrashZone.module.css'

export interface TrashZoneProps {
  isOver?: boolean
}

export const TrashZone = forwardRef<HTMLDivElement, TrashZoneProps>(
  function TrashZone({ isOver = false }, ref) {
    return (
      <div
        ref={ref}
        className={`${styles.trashZone} ${isOver ? styles.trashZoneOver : ''}`}
        data-testid="trash-zone"
        aria-label="Trash zone"
      >
        <span className={styles.icon} role="img" aria-hidden="true">
          🗑
        </span>
        <span className={styles.label}>Drop to delete</span>
      </div>
    )
  },
)

