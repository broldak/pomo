import { useState } from "react";
import { Timer } from "../components/Timer";
import { TaskSetup } from "../components/TaskSetup";

interface ActiveSession {
  task: string;
  totalPomodoros: number;
}

export default function HomePage() {
  const [session, setSession] = useState<ActiveSession | null>(null);

  const handleStartSession = (task: string, pomodoros: number) => {
    setSession({ task, totalPomodoros: pomodoros });
  };

  const handleAbandon = () => {
    setSession(null);
  };

  return (
    <>
      {session ? (
        <Timer
          task={session.task}
          totalPomodoros={session.totalPomodoros}
          onAbandon={handleAbandon}
        />
      ) : (
        <TaskSetup onStart={handleStartSession} />
      )}
    </>
  );
}
