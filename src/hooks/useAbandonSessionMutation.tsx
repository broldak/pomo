import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const useAbandonSessionMutation = () => {
  const { session } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session_id: string) => {
      const response = await fetch(`/api/v1/sessions/${session_id}/abandon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to abandon session");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["current-session"], null);
    },
  });
};

export default useAbandonSessionMutation;
