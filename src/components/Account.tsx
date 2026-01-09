import {
  Button,
  Box,
  Text,
  Container,
  Stack,
  Flex,
  ActionIcon,
  Loader,
  Card,
  Group,
  Center,
} from "@mantine/core";
import { Link } from "react-router";
import { colors } from "../theme";
import { IconBrandSlack, IconCheck, IconX } from "@tabler/icons-react";
import useSupabase from "../hooks/useSupabase";
import useGetSlackIntegration from "../hooks/useGetSlackIntegration";

// TODO: Improve account page layout and design
export default function Account() {
  const { user, session, signOut, loading } = useSupabase();
  const { data: slackIntegration, isLoading: isLoadingSlackIntegration } =
    useGetSlackIntegration();

  const handleConnectSlack = () => {
    // TODO: Implement Slack OAuth flow
    console.log("Connect to Slack clicked");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--mantine-color-dark-8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      <Container
        display="flex"
        style={{ flexDirection: "column" }}
        w="100%"
        h="100%"
        size="lg"
      >
        <Flex justify="flex-end" align="center" w="100%">
          <Link to="/">
            <ActionIcon variant="subtle" color={colors.link} size="lg">
              <IconX size={24} />
            </ActionIcon>
          </Link>
        </Flex>

        <Stack flex={1} justify="center" align="center" gap="xl">
          <Text
            c="gray.5"
            size="sm"
            tt="uppercase"
            fw={500}
            style={{ letterSpacing: "0.1em" }}
          >
            Account
          </Text>

          {loading ? (
            <Loader />
          ) : user && session ? (
            <Stack gap="md" maw={800} w="100%">
              <Card
                withBorder
                bg="gray.8"
                style={{ borderColor: "var(--mantine-color-gray-7)" }}
                p="xl"
                radius="md"
                w="100%"
              >
                <Stack gap="md">
                  <Stack gap="md">
                    <Stack gap="xs">
                      <Text size="xs" c="gray.6" tt="uppercase" fw={600}>
                        Email
                      </Text>
                      <Text c="gray.3" size="sm">
                        {user.email}
                      </Text>
                    </Stack>
                    <Stack gap="xs">
                      <Text size="xs" c="gray.6" tt="uppercase" fw={600}>
                        Name
                      </Text>
                      <Text c="gray.3" size="sm">
                        {user.user_metadata.name}
                      </Text>
                    </Stack>
                    <Button
                      onClick={handleSignOut}
                      size="md"
                      variant="outline"
                      color={colors.link}
                      fullWidth
                    >
                      Sign Out
                    </Button>
                  </Stack>
                </Stack>
              </Card>

              <Card
                withBorder
                bg="gray.8"
                style={{ borderColor: "var(--mantine-color-gray-7)" }}
                p="xl"
                radius="md"
                w="100%"
              >
                <Stack gap="md">
                  <Text size="xs" c="gray.6" tt="uppercase" fw={600}>
                    Integrations
                  </Text>

                  {isLoadingSlackIntegration ? (
                    <Center>
                      <Loader />
                    </Center>
                  ) : (
                    <>
                      {slackIntegration?.has_slack_integration ? (
                        <Group gap="xs" align="center">
                          <IconCheck size={16} color={colors.success} />
                          <Text
                            c="gray.5"
                            size="sm"
                            style={{ lineHeight: 1.6 }}
                          >
                            Slack integration is connected
                          </Text>
                        </Group>
                      ) : (
                        <>
                          <Text
                            c="gray.5"
                            size="sm"
                            style={{ lineHeight: 1.6 }}
                          >
                            Connect your Slack account to automaticallymute
                            notifications and set your status to during active
                            tasks, helping you stay focused without
                            interruptions.
                          </Text>
                          <Link
                            to={`${window.location.origin}/api/v1/integrations/slack/authorize`}
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              onClick={handleConnectSlack}
                              size="md"
                              variant="filled"
                              fullWidth
                            >
                              <Group gap="xs">
                                <IconBrandSlack />
                                <>Connect to Slack</>
                              </Group>
                            </Button>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </Stack>
              </Card>
            </Stack>
          ) : (
            <Text c="gray.6">No active session</Text>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
