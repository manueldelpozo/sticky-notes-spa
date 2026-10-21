export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'] as const

export type NoteColor = (typeof NOTE_COLORS)[number]

export const NOTE_COLOR_MAP: Record<NoteColor, string> = {
  yellow: '#fef08a',
  pink: '#fda4af',
  blue: '#93c5fd',
  green: '#86efac',
}
