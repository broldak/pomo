import { useMutation } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const useAdvanceSessionMutation = () => {
  const { session } = useSupabase();

  return useMutation({
    mutationFn: async (session_id: string) => {
      const response = await fetch(`/api/v1/sessions/${session_id}/advance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to advance session");
      }

      return response.json();
    },
  });
};

export default useAdvanceSessionMutation;
