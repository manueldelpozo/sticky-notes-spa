import styles from './TrashZone.module.css'

interface TrashZoneProps {
  isOver?: boolean
}

export function TrashZone({ isOver = false }: TrashZoneProps) {
  return (
    <div
      className={`${styles.trashZone} ${isOver ? styles.trashZoneOver : ''}`}
      data-testid="trash-zone"
      aria-label="Trash zone"
    >
      <span className={styles.icon} role="img" aria-hidden="true">🗑</span>
      <span className={styles.label}>Drop to delete</span>
    </div>
  )
}
