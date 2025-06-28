import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../../api/authApi/tokenManager";

const PrivateRoute = () => {
    const isAuthenticated = !!getToken();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
