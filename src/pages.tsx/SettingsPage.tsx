import { Settings } from "../components/Settings";
import useSettings from "../hooks/useSettings";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  return <Settings settings={settings} onSave={setSettings} />;
}
