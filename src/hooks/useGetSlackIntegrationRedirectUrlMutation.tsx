import { useMutation } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const useGetSlackIntegrationRedirectUrl = () => {
  const { session } = useSupabase();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/integrations/slack/connect", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Slack integration");
      }

      return response.json();
    },
  });
};

export default useGetSlackIntegrationRedirectUrl;
