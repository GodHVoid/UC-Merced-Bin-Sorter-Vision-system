import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  let token = localStorage.getItem("token");
  return (
      !token ? <Navigate to="/" /> : <Outlet />
  );
}

export default PrivateRoutes;
