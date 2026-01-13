import { useState, useEffect, useCallback, useRef } from "react";
import { Text, Box, Button, Group, UnstyledButton } from "@mantine/core";
import { colors, mantineColors } from "../theme";
import useSettings from "../hooks/useSettings";
import useAbandonSessionMutation from "../hooks/useAbandonSessionMutation";
import usePauseSessionMutation from "../hooks/usePauseSessionMutation";
import useResumeSessionMutation from "../hooks/useResumeSessionMutation";
import useAdvanceSessionMutation from "../hooks/useAdvanceSessionMutation";
import useGetCurrentSession from "../hooks/useGetCurrentSession";

type TimerMode = "work" | "shortBreak" | "longBreak";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface TimerProps {
  task: string;
  totalPomodoros: number;
  onAbandon: () => void;
}

export function Timer({ task, totalPomodoros, onAbandon }: TimerProps) {
  const { settings } = useSettings();
  const workDuration = settings.focusDuration * 60;
  const shortBreak = settings.shortBreak * 60;
  const longBreak = settings.longBreak * 60;

  const abandonMutation = useAbandonSessionMutation();
  const pauseMutation = usePauseSessionMutation();
  const resumeMutation = useResumeSessionMutation();
  const advanceMutation = useAdvanceSessionMutation();

  const { data: currentSession } = useGetCurrentSession();

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(
    currentSession?.focus_cycle_index ?? 0
  );
  const [isComplete, setIsComplete] = useState(false);
  const isCompletingRef = useRef(false);

  const handleAbandon = async () => {
    try {
      await abandonMutation.mutateAsync(currentSession?.id ?? "");
      onAbandon();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleTimer = async () => {
    if (isRunning) {
      await handlePause();
      setIsRunning(false);
    } else {
      await handleResume();
      setIsRunning(true);
    }
  };

  const handlePause = async () => {
    try {
      await pauseMutation.mutateAsync(currentSession?.id ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeMutation.mutateAsync(currentSession?.id ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdvance = useCallback(async () => {
    try {
      await advanceMutation.mutateAsync(currentSession?.id ?? "");
    } catch (error) {
      console.error(error);
    }
  }, [advanceMutation, currentSession]);

  const getDuration = useCallback(
    (timerMode: TimerMode) => {
      switch (timerMode) {
        case "work":
          return workDuration;
        case "shortBreak":
          return shortBreak;
        case "longBreak":
          return longBreak;
      }
    },
    [workDuration, shortBreak, longBreak]
  );

  const handleTimerComplete = useCallback(async () => {
    try {
      await handleAdvance();
    } catch (error) {
      console.error(error);
    }

    if (mode === "work") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      if (newCount >= totalPomodoros) {
        setIsComplete(true);
        setIsRunning(false);
        return;
      }

      if (newCount % settings.blocksBeforeLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(longBreak);
      } else {
        setMode("shortBreak");
        setTimeLeft(shortBreak);
      }
    } else {
      setMode("work");
      setTimeLeft(workDuration);
    }
    setIsRunning(false);
  }, [
    mode,
    completedPomodoros,
    totalPomodoros,
    settings.blocksBeforeLongBreak,
    longBreak,
    shortBreak,
    workDuration,
    handleAdvance,
  ]);

  useEffect(() => {
    if (!isRunning) {
      isCompletingRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isCompletingRef.current) {
            isCompletingRef.current = true;
            console.log("timer complete");
            handleTimerComplete().finally(() => {
              isCompletingRef.current = false;
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, handleTimerComplete]);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const isWork = mode === "work";
  const bgColor = isWork ? colors.work : colors.break;
  const buttonColor = isWork ? mantineColors.work : mantineColors.break;
  const modeLabel = isWork
    ? "Focus"
    : mode === "shortBreak"
      ? "Short Break"
      : "Long Break";
  const progressPercent = (timeLeft / getDuration(mode)) * 100;

  if (isComplete) {
    return (
      <Box
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: colors.break,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <Text c={colors.text.primary} size="xl" fw={700}>
          Session Complete!
        </Text>
        <Text c={colors.text.secondary} size="lg">
          {task}
        </Text>
        <Text c={colors.text.tertiary} size="md">
          {completedPomodoros} pomodoros completed
        </Text>
        <Button
          onClick={handleAbandon}
          size="lg"
          variant="white"
          color={mantineColors.break}
        >
          Start New Task
        </Button>
      </Box>
    );
  }

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Progress bar - top */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "4px",
          width: `${progressPercent}%`,
          backgroundColor: colors.progressBar,
          transition: "width 1s linear",
        }}
      />

      {/* Main content - centered */}
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Text
          c={colors.text.muted}
          size="sm"
          tt="uppercase"
          fw={500}
          style={{ letterSpacing: "0.1em" }}
        >
          {modeLabel}
        </Text>

        <Text
          c={colors.text.primary}
          fw={200}
          style={{ fontSize: "8rem", lineHeight: 1 }}
        >
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
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Group>
          <Button
            onClick={handleToggleTimer}
            size="xl"
            variant="white"
            color={buttonColor}
            w={140}
          >
            {isRunning ? "Pause" : "Start"}
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

        <UnstyledButton onClick={handleAbandon}>
          <Text size="xs" c={colors.text.secondary}>
            abandon session
          </Text>
        </UnstyledButton>
      </Box>
    </Box>
  );
}
