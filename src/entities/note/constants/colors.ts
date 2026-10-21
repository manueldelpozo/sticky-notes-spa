export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'] as const

export type TNoteColor = (typeof NOTE_COLORS)[number]

export const NOTE_COLOR_MAP: Record<TNoteColor, `#${string}`> = {
  yellow: '#fef08a',
  pink: '#fda4af',
  blue: '#93c5fd',
  green: '#86efac',
}
