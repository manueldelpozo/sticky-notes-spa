import styles from './NoteCard.module.css'
import type { Note, NoteColor } from '../model/types'

interface NoteCardProps {
  note: Note
  onDragStart?: (e: React.PointerEvent) => void
  onResizeStart?: (e: React.PointerEvent) => void
  onTextChange?: (text: string) => void
  onColorChange?: (color: NoteColor) => void
  onBringToFront?: () => void
}

const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green']

export function NoteCard({
  note,
  onDragStart,
  onResizeStart,
  onTextChange,
  onColorChange,
  onBringToFront,
}: NoteCardProps) {
  const { id, position, size, text, color, zIndex } = note

  return (
    <article
      className={styles.card}
      data-note-id={id}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        // Expose note color as a CSS custom property for theming
        ['--note-color' as string]: `var(--color-${color})`,
      }}
      onClick={onBringToFront}
    >
      <header
        className={styles.header}
        onPointerDown={onDragStart}
      >
        <div className={styles.colorSwatches}>
          {NOTE_COLORS.map(c => (
            <button
              key={c}
              className={`${styles.swatch} ${c === color ? styles.swatchActive : ''}`}
              style={{ ['--swatch-color' as string]: `var(--color-${c})` }}
              aria-label={`Set note color to ${c}`}
              onClick={e => {
                e.stopPropagation()
                onColorChange?.(c)
              }}
            />
          ))}
        </div>
      </header>

      <textarea
        className={styles.textarea}
        value={text}
        placeholder="Type a note…"
        onChange={e => onTextChange?.(e.target.value)}
        onPointerDown={e => e.stopPropagation()}
      />

      <div
        className={styles.resizeHandle}
        onPointerDown={e => {
          e.stopPropagation()
          onResizeStart?.(e)
        }}
        aria-label="Resize note"
      />
    </article>
  )
}
