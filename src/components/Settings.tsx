import { NumberInput, Button, Box, Text, Stack } from '@mantine/core'
import { mantineColors } from '../theme'
import styles from './NumberInput.module.css'

export interface SettingsValues {
  focusDuration: number      // in minutes
  shortBreak: number         // in minutes
  longBreak: number          // in minutes
  blocksBeforeLongBreak: number
}

interface SettingsProps {
  settings: SettingsValues
  onSave: (settings: SettingsValues) => void
  onClose: () => void
}

export function Settings({ settings, onSave, onClose }: SettingsProps) {
  const handleChange = (key: keyof SettingsValues, value: number) => {
    onSave({ ...settings, [key]: value })
  }

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--mantine-color-dark-8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem',
      }}
    >
      <Text c="gray.5" size="sm" tt="uppercase" fw={500} style={{ letterSpacing: '0.1em' }}>
        Settings
      </Text>

      <Stack gap="lg" w="100%" maw={300}>
        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Focus duration (minutes)
          </Text>
          <NumberInput
            value={settings.focusDuration}
            onChange={(val) => handleChange('focusDuration', typeof val === 'number' ? val : 25)}
            min={1}
            max={120}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-dark-5)',
                border: 'none',
                textAlign: 'center',
                color: 'var(--mantine-color-gray-1)',
              },
            }}
          />
        </Box>

        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Short break (minutes)
          </Text>
          <NumberInput
            value={settings.shortBreak}
            onChange={(val) => handleChange('shortBreak', typeof val === 'number' ? val : 5)}
            min={1}
            max={30}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-dark-5)',
                border: 'none',
                textAlign: 'center',
                color: 'var(--mantine-color-gray-1)',
              },
            }}
          />
        </Box>

        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Long break (minutes)
          </Text>
          <NumberInput
            value={settings.longBreak}
            onChange={(val) => handleChange('longBreak', typeof val === 'number' ? val : 15)}
            min={1}
            max={60}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-dark-5)',
                border: 'none',
                textAlign: 'center',
                color: 'var(--mantine-color-gray-1)',
              },
            }}
          />
        </Box>

        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Blocks before long break
          </Text>
          <NumberInput
            value={settings.blocksBeforeLongBreak}
            onChange={(val) => handleChange('blocksBeforeLongBreak', typeof val === 'number' ? val : 4)}
            min={2}
            max={10}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-dark-5)',
                border: 'none',
                textAlign: 'center',
                color: 'var(--mantine-color-gray-1)',
              },
            }}
          />
        </Box>
      </Stack>

      <Button
        onClick={onClose}
        size="lg"
        color={mantineColors.work}
        variant="filled"
        w={200}
        mt="md"
      >
        Done
      </Button>
    </Box>
  )
}
