import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { colors } from "../theme";
import useSupabase from "../hooks/useSupabase";

export default function Login() {
  const { supabase } = useSupabase();

  const handleSocialLogin = async (provider: "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
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
        w="100%"
        h="100%"
        size="lg"
        display="flex"
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Group gap="xs" align="center" mb="md">
          <Image src="tomato.svg" w="24" h="24" />
          <Title size="30px" order={1} fw={300} c="gray.5">
            pomo
          </Title>
        </Group>

        <Card
          bg="gray.8"
          p="xl"
          withBorder
          maw="540px"
          w="100%"
          ta="center"
          style={{ borderColor: "var(--mantine-color-gray-7)" }}
        >
          <Stack gap="xl">
            <Stack gap="xs">
              <Title c="white" order={3}>
                Welcome to pomo
              </Title>
              <Text c={colors.text.muted} size="sm">
                Let's get you started with an account
              </Text>
            </Stack>
            <Button onClick={() => handleSocialLogin("google")}>
              <Group>
                <IconBrandGoogleFilled />
                <>Login with Google</>
              </Group>
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
