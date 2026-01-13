import { Timer } from "../components/Timer";
import { TaskSetup } from "../components/TaskSetup";
import useGetCurrentSession from "../hooks/useGetCurrentSession";
import { Box, Center, Loader } from "@mantine/core";

export default function HomePage() {
  const { data: currentSession, isLoading: isLoadingCurrentSession } =
    useGetCurrentSession();

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
      />
    );
  }

  return <TaskSetup />;
}
