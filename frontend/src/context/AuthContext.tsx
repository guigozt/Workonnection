import { createContext, useState, useEffect } from "react";
import type { ReactNode } from 'react';
import { authService } from "../services/authService";
import type { UsuarioResponseDTO, LoginDTO } from "../types/auth";

interface AuthContextData {
    usuario: UsuarioResponseDTO | null;
    loading: boolean;
    login: (dados: LoginDTO) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<UsuarioResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService.buscarUsuarioLogado()
            .then((user) => setUsuario(user))
            .catch(() => setUsuario(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (dados: LoginDTO) => {
        const user = await authService.login(dados);
        setUsuario(user);
    };

    const logout = async () => {
        await authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };