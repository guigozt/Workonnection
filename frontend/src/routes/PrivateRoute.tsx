import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({
    children
}: {
    children: React.ReactNode;
}) => {

    const {
        usuario,
        loading
    } = useAuth();

    if (loading) {

        return (
            <div>
                Carregando...
            </div>
        );

    }

    if (!usuario) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return (
        <>
            {children}
        </>
    );
};