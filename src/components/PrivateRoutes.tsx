import { Navigate, Outlet } from "react-router";
import useSupabase from "../hooks/useSupabase";

const PrivateRoutes = () => {
  const { session, loading: isLoadingSession } = useSupabase();

  if (!isLoadingSession && !session) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
