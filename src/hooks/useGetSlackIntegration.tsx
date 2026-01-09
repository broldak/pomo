import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import type { Session } from "@supabase/supabase-js";

const fetchSlackIntegration = async (session: Session | null) => {
  const response = await fetch("/api/v1/integrations/slack", {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Slack integration");
  }

  return response.json();
};

const useGetSlackIntegration = () => {
  const { session } = useSupabase();

  return useQuery<{ has_slack_integration: boolean }>({
    queryKey: ["slack-integration"],
    queryFn: () => fetchSlackIntegration(session),
    enabled: !!session,
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetSlackIntegration;
