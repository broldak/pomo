import { useState, useEffect, useCallback } from 'react'
import { Text, Box, Button, Group, UnstyledButton } from '@mantine/core'
import { colors, mantineColors } from '../theme'
import type { SettingsValues } from './Settings'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

interface TimerProps {
  task: string
  totalPomodoros: number
  settings: SettingsValues
  onAbandon: () => void
}

export function Timer({ task, totalPomodoros, settings, onAbandon }: TimerProps) {
  const workDuration = settings.focusDuration * 60
  const shortBreak = settings.shortBreak * 60
  const longBreak = settings.longBreak * 60

  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const getDuration = useCallback((timerMode: TimerMode) => {
    switch (timerMode) {
      case 'work': return workDuration
      case 'shortBreak': return shortBreak
      case 'longBreak': return longBreak
    }
  }, [workDuration, shortBreak, longBreak])

  const handleTimerComplete = useCallback(() => {
    if (mode === 'work') {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)

      if (newCount >= totalPomodoros) {
        setIsComplete(true)
        setIsRunning(false)
        return
      }

      if (newCount % settings.blocksBeforeLongBreak === 0) {
        setMode('longBreak')
        setTimeLeft(longBreak)
      } else {
        setMode('shortBreak')
        setTimeLeft(shortBreak)
      }
    } else {
      setMode('work')
      setTimeLeft(workDuration)
    }
    setIsRunning(false)
  }, [mode, completedPomodoros, totalPomodoros, settings.blocksBeforeLongBreak, longBreak, shortBreak, workDuration])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, handleTimerComplete])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(mode))
  }

  const isWork = mode === 'work'
  const bgColor = isWork ? colors.work : colors.break
  const buttonColor = isWork ? mantineColors.work : mantineColors.break
  const modeLabel = isWork ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'
  const progressPercent = (timeLeft / getDuration(mode)) * 100

  if (isComplete) {
    return (
      <Box
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: colors.break,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <Text c={colors.text.primary} size="xl" fw={700}>Session Complete!</Text>
        <Text c={colors.text.secondary} size="lg">
          {task}
        </Text>
        <Text c={colors.text.tertiary} size="md">
          {completedPomodoros} pomodoros completed
        </Text>
        <Button
          onClick={onAbandon}
          size="lg"
          variant="white"
          color={mantineColors.break}
        >
          Start New Task
        </Button>
      </Box>
    )
  }

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Progress bar - top */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '4px',
          width: `${progressPercent}%`,
          backgroundColor: colors.progressBar,
          transition: 'width 1s linear',
        }}
      />

      {/* Main content - centered */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <Text c={colors.text.muted} size="sm" tt="uppercase" fw={500} style={{ letterSpacing: '0.1em' }}>
          {modeLabel}
        </Text>

        <Text c={colors.text.primary} fw={200} style={{ fontSize: '8rem', lineHeight: 1 }}>
          {formatTime(timeLeft)}
        </Text>

        <Text c={colors.text.secondary} size="xl" fw={500} mt="md">
          {task}
        </Text>

        <Text c={colors.text.faint} size="sm" mt="xs">
          {completedPomodoros} / {totalPomodoros}
        </Text>
      </Box>

      {/* Controls - bottom */}
      <Box
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Group>
          <Button
            onClick={toggleTimer}
            size="xl"
            variant="white"
            color={buttonColor}
            w={140}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            onClick={resetTimer}
            size="xl"
            variant="outline"
            c={colors.text.primary}
            bd={`1px solid ${colors.text.primary}`}
          >
            Reset
          </Button>
        </Group>

        <UnstyledButton onClick={onAbandon}>
          <Text size="xs" c={colors.text.secondary}>
            abandon session
          </Text>
        </UnstyledButton>
      </Box>
    </Box>
  )
}
