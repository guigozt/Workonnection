import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { usuario, loading } = useContext(AuthContext);

    if (loading) return <div>Carregando...</div> //No futuro, troque por um Spinner bonitão
    if (!usuario) return <Navigate to="/login" replace />;

    return <> {children} </>
};
