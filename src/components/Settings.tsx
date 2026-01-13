import { NumberInput, Button, Box, Text, Stack } from "@mantine/core";
import { mantineColors } from "../theme";
import styles from "./NumberInput.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";

export interface SettingsValues {
  focusDuration: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
  blocksBeforeLongBreak: number;
}

interface SettingsProps {
  settings: SettingsValues;
  onSave: (settings: SettingsValues) => void;
}

export function Settings({ settings, onSave }: SettingsProps) {
  const navigate = useNavigate();

  const [focusDuration, setFocusDuration] = useState(settings.focusDuration);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [blocksBeforeLongBreak, setBlocksBeforeLongBreak] = useState(
    settings.blocksBeforeLongBreak
  );

  const handleSave = () => {
    onSave({
      ...settings,
      focusDuration,
      shortBreak,
      longBreak,
      blocksBeforeLongBreak,
    });
  };

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--mantine-color-dark-8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      <Text
        c="gray.5"
        size="sm"
        tt="uppercase"
        fw={500}
        style={{ letterSpacing: "0.1em" }}
      >
        Settings
      </Text>

      <Stack gap="lg" w="100%" maw={300}>
        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Focus duration (minutes)
          </Text>
          <NumberInput
            value={focusDuration}
            onChange={(val) =>
              setFocusDuration(typeof val === "number" ? val : 25)
            }
            min={1}
            max={45}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: "var(--mantine-color-dark-5)",
                border: "none",
                textAlign: "center",
                color: "var(--mantine-color-gray-1)",
              },
            }}
          />
        </Box>

        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Short break (minutes)
          </Text>
          <NumberInput
            value={shortBreak}
            onChange={(val) => setShortBreak(typeof val === "number" ? val : 5)}
            min={1}
            max={20}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: "var(--mantine-color-dark-5)",
                border: "none",
                textAlign: "center",
                color: "var(--mantine-color-gray-1)",
              },
            }}
          />
        </Box>

        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Long break (minutes)
          </Text>
          <NumberInput
            value={longBreak}
            onChange={(val) => setLongBreak(typeof val === "number" ? val : 15)}
            min={1}
            max={45}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: "var(--mantine-color-dark-5)",
                border: "none",
                textAlign: "center",
                color: "var(--mantine-color-gray-1)",
              },
            }}
          />
        </Box>

        <Box>
          <Text c="gray.5" size="sm" mb={4}>
            Blocks before long break
          </Text>
          <NumberInput
            value={blocksBeforeLongBreak}
            onChange={(val) =>
              setBlocksBeforeLongBreak(typeof val === "number" ? val : 4)
            }
            min={2}
            max={10}
            size="md"
            classNames={{ control: styles.numberInputControl }}
            styles={{
              input: {
                backgroundColor: "var(--mantine-color-dark-5)",
                border: "none",
                textAlign: "center",
                color: "var(--mantine-color-gray-1)",
              },
            }}
          />
        </Box>
      </Stack>

      <Button
        onClick={() => {
          handleSave();
          navigate("/");
        }}
        size="lg"
        color={mantineColors.work}
        variant="filled"
        w={200}
        mt="md"
      >
        Done
      </Button>
    </Box>
  );
}
