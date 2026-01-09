import "./App.css";
import { Route, Routes } from "react-router";
import LoginPage from "./pages.tsx/LoginPage";
import PrivateRoutes from "./components/PrivateRoutes";
import SettingsPage from "./pages.tsx/SettingsPage";
import AccountPage from "./pages.tsx/AccountPage";
import HomePage from "./pages.tsx/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}

export default App;
