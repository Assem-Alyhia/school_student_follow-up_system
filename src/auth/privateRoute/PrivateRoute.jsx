// src/auth/privateRoute/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../../api/authApi/tokenManager";

const readRolesFromLocal = () => {
    try {
        const raw = localStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        const roles = Array.isArray(u?.roles) ? u.roles : [];
        // يدعم شكلين: [{name:'admin'}] أو ['admin']
        return roles
            .map(r => (typeof r === "string" ? r : r?.name))
            .filter(Boolean)
            .map(s => s.toLowerCase());
    } catch {
        return [];
    }
};

const homeByRoles = (roles) => {
    if (roles.includes("admin")) return "/dashboard";
    if (roles.includes("teacher")) return "/teacherDashboard";
    if (roles.includes("parent")) return "/parentDashboard";
    if (roles.includes("supervisor")) return "/supervisorDashboard";
    return "/login";
};

const pathAllowedForRoles = (path, roles) => {
    const map = {
        admin: ["/dashboard"],
        teacher: ["/teacherDashboard"],
        parent: ["/parentDashboard"],
        supervisor: ["/supervisorDashboard"],
    };
    return roles.some(role =>
        (map[role] || []).some(prefix => path.startsWith(prefix))
    );
};

export default function PrivateRoute() {
    const isAuthenticated = !!getToken();
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const roles = readRolesFromLocal();
    const home = homeByRoles(roles);
    const path = location.pathname || "/";

    if (path === "/" || path === "") return <Navigate to={home} replace />;
    if (!pathAllowedForRoles(path, roles)) return <Navigate to={home} replace />;

    return <Outlet />;
}
