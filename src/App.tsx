import { useState } from 'react'
import { Container, Stack } from '@mantine/core'
import { TaskSetup } from './components/TaskSetup'
import { Timer } from './components/Timer'
import { Settings, type SettingsValues } from './components/Settings'
import './App.css'

const STORAGE_KEY = 'pomo-settings'

const DEFAULT_SETTINGS: SettingsValues = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  blocksBeforeLongBreak: 4,
}

function loadSettings(): SettingsValues {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_SETTINGS
}

interface ActiveSession {
  task: string
  totalPomodoros: number
}

function App() {
  const [session, setSession] = useState<ActiveSession | null>(null)
  const [settings, setSettings] = useState<SettingsValues>(loadSettings)
  const [showSettings, setShowSettings] = useState(false)

  const handleSaveSettings = (newSettings: SettingsValues) => {
    setSettings(newSettings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
  }

  const handleStartSession = (task: string, pomodoros: number) => {
    setSession({ task, totalPomodoros: pomodoros })
  }

  const handleAbandon = () => {
    setSession(null)
  }

  if (showSettings) {
    return (
      <Settings
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setShowSettings(false)}
      />
    )
  }

  return (
    <Container size="xs" py="xl">
      <Stack align="center" gap="lg">

        {session ? (
          <Timer
            task={session.task}
            totalPomodoros={session.totalPomodoros}
            settings={settings}
            onAbandon={handleAbandon}
          />
        ) : (
          <TaskSetup
            settings={settings}
            onStart={handleStartSession}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </Stack>
    </Container>
  )
}

export default App
