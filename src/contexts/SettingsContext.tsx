import { createContext, useEffect, useState, type ReactNode } from "react";
import type { SettingsValues } from "../components/Settings";

const STORAGE_KEY = "pomo-settings";

const DEFAULT_SETTINGS: SettingsValues = {
  focusDuration: 0.05,
  shortBreak: 0.05,
  longBreak: 0.05,
  blocksBeforeLongBreak: 2,
};

function loadSettings(): SettingsValues {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

// Context types
interface SettingsContextType {
  settings: SettingsValues;
  setSettings: (settings: SettingsValues) => void;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettingsState] = useState<SettingsValues>(loadSettings);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSettings = (newSettings: SettingsValues) => {
    setSettingsState(newSettings);
  };

  const value = {
    settings,
    setSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Export the context for direct access if needed
export { SettingsContext };
