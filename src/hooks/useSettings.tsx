import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

// Custom hook to use Settings context
export default function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
