import { useState } from "react";
import { Timer } from "../components/Timer";
import { TaskSetup } from "../components/TaskSetup";
import useGetCurrentSession from "../hooks/useGetCurrentSession";
import { Box, Center, Loader } from "@mantine/core";

interface ActiveSession {
  task: string;
  totalPomodoros: number;
}

export default function HomePage() {
  const [session, setSession] = useState<ActiveSession | null>(null);
  const { data: currentSession, isLoading: isLoadingCurrentSession } =
    useGetCurrentSession();

  const handleStartSession = (task: string, pomodoros: number) => {
    setSession({ task, totalPomodoros: pomodoros });
  };

  const handleAbandon = () => {
    setSession(null);
  };

  debugger;

  if (isLoadingCurrentSession) {
    return (
      <Box h="100vh" w="100vw" bg="dark.8">
        <Center h="100%" w="100%">
          <Loader />
        </Center>
      </Box>
    );
  }

  if (currentSession) {
    return (
      <Timer
        task={currentSession.session_name}
        totalPomodoros={currentSession.focus_count}
        onAbandon={handleAbandon}
      />
    );
  }

  return <TaskSetup onStart={handleStartSession} />;
}
