import type { MantineThemeOverride } from '@mantine/core'

export const theme: MantineThemeOverride = {
  fontFamily: 'Geist, sans-serif',
  primaryColor: 'red',
  primaryShade: 8,
  other: {
    // Semantic mode colors
    workBg: 'var(--mantine-color-red-9)',
    breakBg: 'var(--mantine-color-teal-9)',
    // Text opacity variants
    textPrimary: 'rgba(255, 255, 255, 1)',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textTertiary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    textFaint: 'rgba(255, 255, 255, 0.5)',
    // UI elements
    progressBar: 'rgba(255, 255, 255, 0.5)',
  },
}

export * from './colors'
