import { api } from "./api";

import type {
    LoginDTO,
    CadastroDTO,
    VerificarCodigoDTO,
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
        } catch (error) {
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
        } catch (error) {
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

        } catch (error) {
            console.error(
                "❌ AUTH SERVICE: erro no login",
                error
            );
            throw error;
        }
    },

    cadastrar: async (
        dadosCadastro: CadastroDTO
    ): Promise<UsuarioResponseDTO> => {
        console.log("AUTH SERVICE: cadastrando novo usuário...");
        try {
            const response = await api.post<UsuarioResponseDTO>(
                "/usuarios",
                dadosCadastro
            );
            return response.data;
        } catch (error) {
            console.error("❌ AUTH SERVICE: erro ao cadastrar usuário", error);
            throw error;
        }
    },

    verificarCodigo: async (
        dados: VerificarCodigoDTO
    ): Promise<UsuarioResponseDTO> => {
        console.log("AUTH SERVICE: verificando código de confirmação...");
        try {
            const response = await api.post<UsuarioResponseDTO>(
                "/usuarios/verificar-codigo",
                dados
            );
            if (response.data && response.data.id) {
                localStorage.setItem("usuarioId", response.data.id);
            }
            return response.data;
        } catch (error) {
            console.error("❌ AUTH SERVICE: erro ao verificar código", error);
            throw error;
        }
    },

    reenviarCodigo: async (
        email: string
    ): Promise<void> => {
        console.log("AUTH SERVICE: reenviando código...");
        try {
            await api.post("/usuarios/reenviar-codigo", { email });
        } catch (error) {
            console.error("❌ AUTH SERVICE: erro ao reenviar código", error);
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

        } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            console.log(
                "AUTH SERVICE: nenhum usuário logado",
                err?.response?.status
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
    },

    atualizarConfiguracoes: async (dados: { tema?: string; idioma?: string }): Promise<UsuarioResponseDTO> => {
        const response = await api.put<UsuarioResponseDTO>("/usuarios/configuracoes", dados);
        return response.data;
    },

    excluirConta: async (): Promise<void> => {
        try {
            await api.delete("/usuarios/conta");
        } finally {
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("authToken");
        }
    }
};