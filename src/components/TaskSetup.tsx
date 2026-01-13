import { useState } from "react";
import {
  TextInput,
  NumberInput,
  Button,
  Box,
  Text,
  ActionIcon,
  Stack,
  Flex,
  Title,
  Container,
  Group,
  Image,
} from "@mantine/core";
import { IconSettings, IconUser } from "@tabler/icons-react";
import { colors, mantineColors } from "../theme";
import classes from "./NumberInput.module.css";
import useSettings from "../hooks/useSettings";
import { Link } from "react-router";
import useCreateNewSessionMutation from "../hooks/useCreateNewSessionMutation";

export function TaskSetup() {
  const { settings } = useSettings();
  const [task, setTask] = useState("");
  const [pomodoros, setPomodoros] = useState<number>(4);

  const mutate = useCreateNewSessionMutation();

  const handleStart = async () => {
    if (task.trim() && pomodoros > 0) {
      try {
        await mutate.mutateAsync(task.trim());
      } catch (error) {
        console.error(error);
      }
    }
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
      <Container
        display="flex"
        style={{ flexDirection: "column" }}
        w="100%"
        h="100%"
        size="lg"
      >
        <Flex justify="space-between" align="center" w="100%">
          <Group gap="xs" align="center">
            <Image src="tomato.svg" w="24" h="24" />
            <Title size="30px" order={1} fw={300} c={colors.text.primary}>
              pomo
            </Title>
          </Group>
          <Group>
            <Link to="/settings">
              <ActionIcon variant="subtle" color={colors.link} size="lg">
                <IconSettings size={24} />
              </ActionIcon>
            </Link>
            <Link to="/account">
              <ActionIcon variant="subtle" color={colors.link} size="lg">
                <IconUser size={24} />
              </ActionIcon>
            </Link>
          </Group>
        </Flex>

        <Stack align="center" justify="center" gap="xl" w="100%" flex={1}>
          <Text
            c="gray.5"
            size="sm"
            tt="uppercase"
            fw={500}
            style={{ letterSpacing: "0.1em" }}
          >
            New Session
          </Text>

          <TextInput
            placeholder="What are you working on?"
            value={task}
            onChange={(e) => setTask(e.currentTarget.value)}
            size="xl"
            w="100%"
            maw={400}
            styles={{
              input: {
                backgroundColor: "var(--mantine-color-dark-5)",
                border: "none",
                textAlign: "center",
                fontSize: "1.25rem",
                color: "var(--mantine-color-gray-1)",
              },
            }}
          />

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Text c="gray.5" size="sm">
              How many pomodoros?
            </Text>
            <NumberInput
              value={pomodoros}
              onChange={(val) =>
                setPomodoros(typeof val === "number" ? val : 4)
              }
              min={1}
              max={12}
              size="xl"
              w={120}
              styles={{
                input: {
                  backgroundColor: "var(--mantine-color-dark-5)",
                  border: "none",
                  textAlign: "center",
                  fontSize: "2rem",
                  fontWeight: 200,
                  color: "var(--mantine-color-gray-1)",
                },
              }}
              classNames={{ control: classes.numberInputControl }}
            />
          </Box>

          <Text c="gray.5" size="sm">
            {pomodoros} x {settings.focusDuration} min ={" "}
            {Math.floor((pomodoros * settings.focusDuration) / 60)}h{" "}
            {(pomodoros * settings.focusDuration) % 60}m of focus time
          </Text>

          <Button
            onClick={handleStart}
            size="xl"
            color={mantineColors.work}
            variant={!task.trim() || pomodoros < 1 ? "outline" : "filled"}
            disabled={!task.trim() || pomodoros < 1}
            w={200}
            mt="md"
          >
            Start Session
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
