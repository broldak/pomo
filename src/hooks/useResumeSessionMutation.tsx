import { useMutation } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const useResumeSessionMutation = () => {
  const { session } = useSupabase();

  return useMutation({
    mutationFn: async (session_id: string) => {
      const response = await fetch(`/api/v1/sessions/${session_id}/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resume session");
      }

      return response.json();
    },
  });
};

export default useResumeSessionMutation;
