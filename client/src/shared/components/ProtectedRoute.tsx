import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/authStore";
import type { ReactNode } from "react";


interface Props{  
    children: ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute = ({children,adminOnly = false}: Props) => {
    const user = useAuthStore((state) => state.user);

    if(!user) return <Navigate to="/login" replace/>;
    if(adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace/>;

    return children;
};

export default ProtectedRoute;


