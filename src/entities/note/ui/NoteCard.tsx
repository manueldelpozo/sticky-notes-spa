import { type PointerEvent as ReactPointerEvent } from 'react'
import styles from './NoteCard.module.css'
import type { Note, NoteColor } from '../model/types'
import { NOTE_COLORS, NOTE_COLOR_MAP } from '../constants'

interface NoteCardProps {
  note: Note
  onDragStart?: (event: ReactPointerEvent<HTMLElement>) => void
  onResizeStart?: (event: ReactPointerEvent<HTMLElement>) => void
  onTextChange?: (text: string) => void
  onColorChange?: (color: NoteColor) => void
  onBringToFront?: () => void
}

export function NoteCard({
  note,
  onDragStart,
  onResizeStart,
  onTextChange,
  onColorChange,
  onBringToFront,
}: NoteCardProps) {
  const { id, position, size, text, color, zIndex } = note
  const currentColorHex = NOTE_COLOR_MAP[color] ?? NOTE_COLOR_MAP.yellow

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
        backgroundColor: currentColorHex,
        ['--note-color' as string]: currentColorHex,
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
              type="button"
              className={`${styles.swatch} ${c === color ? styles.swatchActive : ''}`}
              style={{
                backgroundColor: NOTE_COLOR_MAP[c],
                ['--swatch-color' as string]: NOTE_COLOR_MAP[c],
              }}
              aria-label={`Set note color to ${c}`}
              onPointerDown={event => {
                event.stopPropagation()
                onColorChange?.(c)
              }}
              onClick={event => {
                event.stopPropagation()
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
        tabIndex={0}
        onChange={event => onTextChange?.(event.target.value)}
        onPointerDown={event => event.stopPropagation()}
        onFocus={event => event.stopPropagation()}
        onBlur={event => event.stopPropagation()}
      />

      <div
        className={styles.resizeHandle}
        onPointerDown={event => {
          event.stopPropagation()
          onResizeStart?.(event)
        }}
        aria-label="Resize note"
      />
    </article>
  )
}
