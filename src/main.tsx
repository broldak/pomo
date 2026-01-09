import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.tsx";
import { theme } from "./theme";
import { BrowserRouter } from "react-router";
import { SupabaseProvider } from "./contexts/SupabaseContext.tsx";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SupabaseProvider>
            <SettingsProvider>
              <App />
            </SettingsProvider>
          </SupabaseProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);
