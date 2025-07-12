import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Loader from "../components/shared/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader/>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="login" state={{ from: location }} replace />;
};

export default PrivateRoute;
