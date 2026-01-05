// Semantic color tokens for the pomodoro timer
export const colors = {
  // Mode backgrounds
  work: 'var(--mantine-color-red-9)',
  break: 'var(--mantine-color-teal-9)',

  // Text colors with opacity variants
  text: {
    primary: 'rgba(255, 255, 255, 1)',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.6)',
    faint: 'rgba(255, 255, 255, 0.5)',
  },

  // UI elements
  progressBar: 'rgba(255, 255, 255, 0.5)',
} as const

// Mantine color names for Button color prop
export const mantineColors = {
  work: 'red',
  break: 'teal',
} as const

export type ColorMode = 'work' | 'break'
