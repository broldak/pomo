import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import type { Session } from "@supabase/supabase-js";

export interface CurrentSession {
  id: string;
  session_name: string;
  current_phase: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  current_status: "RUNNING" | "PAUSED" | "ABANDONED";
  focus_blocks_before_long_break: number;
  focus_count: number;
  focus_cycle_index: number;
  focus_duration_seconds: number;
  long_break_cycle_index: number;
  long_break_duration_seconds: number;
  phase_started_at: string;
  session_version: number;
  short_break_cycle_index: number;
  short_break_duration_seconds: number;
  created_at: string;
  updated_at: string;
}

const fetchCurrentSession = async (session: Session | null) => {
  const response = await fetch("/api/v1/sessions/current", {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current session");
  }

  return response.json();
};

const useGetCurrentSession = () => {
  const { session } = useSupabase();

  return useQuery<CurrentSession>({
    queryKey: ["current-session"],
    queryFn: () => fetchCurrentSession(session),
    enabled: !!session,
    retry: 0,
  });
};

export default useGetCurrentSession;
