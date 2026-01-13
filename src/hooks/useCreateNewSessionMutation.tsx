import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import useSettings from "./useSettings";

const useCreateNewSessionMutation = () => {
  const { session } = useSupabase();
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session_name: string) => {
      const response = await fetch("/api/v1/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_details: {
            focus_duration_seconds: settings.focusDuration * 60,
            short_break_duration_seconds: settings.shortBreak * 60,
            long_break_duration_seconds: settings.longBreak * 60,
            focus_count: settings.blocksBeforeLongBreak,
            focus_blocks_before_long_break: settings.blocksBeforeLongBreak,
          },
          session_name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create new session");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-session"] });
    },
  });
};

export default useCreateNewSessionMutation;
