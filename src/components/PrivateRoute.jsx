import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../providers/auth-provider";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
