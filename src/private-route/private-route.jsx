import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const toggleRoutesPermission = localStorage.getItem("auth");
  let location = useLocation();

  return toggleRoutesPermission ? (
    children
  ) : (
    <Navigate
      to={"/auth/local" || "/auth/register" || "/auth/forgot-pass"}
      state={{ from: location }}
      replace
    />
  );
};
export const PrivateRouteAuth = ({ children }) => {
  const toggleRoutesPermission = localStorage.getItem("auth");
  let location = useLocation();

  return toggleRoutesPermission ? (
    <Navigate to="/books/all" state={{ from: location }} replace />
  ) : (
    children
  );
};
