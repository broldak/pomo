import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

const renderApp = () => {
  return render(
    <MantineProvider>
      <App />
    </MantineProvider>
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initial render', () => {
    it('renders the TaskSetup screen by default', () => {
      renderApp()
      expect(screen.getByText('New Session')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('What are you working on?')).toBeInTheDocument()
      expect(screen.getByText('How many pomodoros?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start Session' })).toBeInTheDocument()
    })

    it('shows default settings calculation', () => {
      renderApp()
      // Default: 4 pomodoros x 25 min = 1h 40m
      expect(screen.getByText(/4 x 25 min = 1h 40m of focus time/)).toBeInTheDocument()
    })
  })

  describe('starting a session', () => {
    it('starts a session when task is entered and start is clicked', async () => {
      const user = userEvent.setup()
      renderApp()

      const taskInput = screen.getByPlaceholderText('What are you working on?')
      await user.type(taskInput, 'Write tests')
      await user.click(screen.getByRole('button', { name: 'Start Session' }))

      // Should now show the Timer screen
      expect(screen.getByText('Write tests')).toBeInTheDocument()
      expect(screen.getByText('Focus')).toBeInTheDocument()
      expect(screen.getByText('0 / 4')).toBeInTheDocument()
    })

    it('disables start button when task is empty', () => {
      renderApp()
      expect(screen.getByRole('button', { name: 'Start Session' })).toBeDisabled()
    })
  })

  describe('abandoning a session', () => {
    it('returns to TaskSetup when session is abandoned', async () => {
      const user = userEvent.setup()
      renderApp()

      // Start a session
      await user.type(screen.getByPlaceholderText('What are you working on?'), 'Test task')
      await user.click(screen.getByRole('button', { name: 'Start Session' }))

      // Abandon the session
      await user.click(screen.getByText('abandon session'))

      // Should be back on TaskSetup
      expect(screen.getByText('New Session')).toBeInTheDocument()
    })
  })

  describe('settings', () => {
    it('opens settings when settings button is clicked', async () => {
      const user = userEvent.setup()
      renderApp()

      // Click the settings button (icon button)
      const settingsButton = screen.getByRole('button', { name: '' })
      await user.click(settingsButton)

      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Focus duration (minutes)')).toBeInTheDocument()
    })

    it('closes settings and returns to TaskSetup', async () => {
      const user = userEvent.setup()
      renderApp()

      // Open settings
      const settingsButton = screen.getByRole('button', { name: '' })
      await user.click(settingsButton)

      // Close settings
      await user.click(screen.getByRole('button', { name: 'Done' }))

      expect(screen.getByText('New Session')).toBeInTheDocument()
    })

    it('persists settings to localStorage', async () => {
      const user = userEvent.setup()
      renderApp()

      // Open settings
      const settingsButton = screen.getByRole('button', { name: '' })
      await user.click(settingsButton)

      // Change focus duration - find by display value (25 is the default)
      const focusInput = screen.getByDisplayValue('25')
      await user.clear(focusInput)
      await user.type(focusInput, '30')

      // Close settings
      await user.click(screen.getByRole('button', { name: 'Done' }))

      // Check localStorage was updated
      const stored = JSON.parse(localStorage.getItem('pomo-settings') || '{}')
      expect(stored.focusDuration).toBe(30)
    })

    it('loads settings from localStorage on mount', () => {
      localStorage.setItem('pomo-settings', JSON.stringify({
        focusDuration: 30,
        shortBreak: 10,
        longBreak: 20,
        blocksBeforeLongBreak: 3,
      }))

      renderApp()

      // Should show calculation with custom settings: 4 x 30 = 2h 0m
      expect(screen.getByText(/4 x 30 min = 2h 0m of focus time/)).toBeInTheDocument()
    })
  })

  describe('timer functionality', () => {
    it('displays timer in correct format', async () => {
      const user = userEvent.setup()
      renderApp()

      await user.type(screen.getByPlaceholderText('What are you working on?'), 'Test')
      await user.click(screen.getByRole('button', { name: 'Start Session' }))

      // Default 25 min = 25:00
      expect(screen.getByText('25:00')).toBeInTheDocument()
    })

    it('shows Start button initially, Pause when running', async () => {
      const user = userEvent.setup()
      renderApp()

      await user.type(screen.getByPlaceholderText('What are you working on?'), 'Test')
      await user.click(screen.getByRole('button', { name: 'Start Session' }))

      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Start' }))
      expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    })

    it('has Reset button available', async () => {
      const user = userEvent.setup()
      renderApp()

      await user.type(screen.getByPlaceholderText('What are you working on?'), 'Test')
      await user.click(screen.getByRole('button', { name: 'Start Session' }))

      // Verify initial state and Reset button exists
      expect(screen.getByText('25:00')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })
  })
})
