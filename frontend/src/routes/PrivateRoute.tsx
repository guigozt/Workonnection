import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { usuario, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!usuario.cadastroCompleto && location.pathname !== "/cadastro") {
        return <Navigate to="/cadastro" replace />;
    }

    return <>{children}</>;
};