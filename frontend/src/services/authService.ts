import { api } from "./api";

import type {
    LoginDTO,
    CompletarCadastroDTO,
    UsuarioResponseDTO
} from "../types/auth";

export const authService = {

    loginComGoogleToken: async (
        token: string
    ): Promise<UsuarioResponseDTO> => {
        console.log("AUTH SERVICE: autenticando via Google Token...");

        try {
            const response = await api.post<UsuarioResponseDTO>(
                "/auth/google",
                { token }
            );

            console.log("AUTH SERVICE: resposta do Google recebida:", response.data);

            if (response.data && response.data.id) {
                localStorage.setItem("usuarioId", response.data.id);
            }

            return response.data;
        } catch (error: any) {
            console.error("❌ AUTH SERVICE: erro ao autenticar com token Google", error);
            throw error;
        }
    },

    completarCadastro: async (
        dados: CompletarCadastroDTO
    ): Promise<UsuarioResponseDTO> => {
        console.log("AUTH SERVICE: enviando dados de complementação de cadastro...");

        try {
            const response = await api.post<UsuarioResponseDTO>(
                "/usuarios/completar-cadastro",
                dados
            );

            if (response.data && response.data.id) {
                localStorage.setItem("usuarioId", response.data.id);
            }

            return response.data;
        } catch (error: any) {
            console.error("❌ AUTH SERVICE: erro ao completar cadastro", error);
            throw error;
        }
    },

    login: async (
        dadosLogin: LoginDTO
    ): Promise<UsuarioResponseDTO> => {

        console.log(
            "AUTH SERVICE: iniciando login no endpoint /usuarios/login"
        );

        try {
            const response =
                await api.post<UsuarioResponseDTO>(
                    "/usuarios/login",
                    dadosLogin
                );

            if (response.data && response.data.id) {
                localStorage.setItem("usuarioId", response.data.id);
            }

            return response.data;

        } catch (error: any) {
            console.error(
                "❌ AUTH SERVICE: erro no login",
                error
            );
            throw error;
        }
    },

    buscarUsuarioLogado: async (): Promise<UsuarioResponseDTO> => {

        console.log(
            "AUTH SERVICE: verificando usuário logado..."
        );

        try {
            const response =
                await api.get<UsuarioResponseDTO>(
                    "/usuarios/me"
                );

            if (response.data && response.data.id) {
                localStorage.setItem("usuarioId", response.data.id);
            }

            return response.data;

        } catch (error: any) {
            console.log(
                "AUTH SERVICE: nenhum usuário logado",
                error?.response?.status
            );
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("authToken");
            throw error;
        }
    },

    logout: async () => {
        console.log(
            "AUTH SERVICE: fazendo logout..."
        );

        try {
            await api.post(
                "/usuarios/logout"
            );
        } catch (error) {
            console.warn("Falha no logout da API, limpando armazenamento local:", error);
        } finally {
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("authToken");
        }

        console.log(
            "AUTH SERVICE: logout realizado"
        );
    }
};