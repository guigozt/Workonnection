import { api } from "./api";

import type {
    LoginDTO,
    CadastroDTO,
    UsuarioResponseDTO
} from "../types/auth";

export const authService = {

    login: async (
        dadosLogin: LoginDTO
    ): Promise<UsuarioResponseDTO> => {

        console.log(
            "AUTH SERVICE: iniciando login"
        );

        console.log(
            "AUTH SERVICE: URL =",
            "http://localhost:8080/usuarios/login"
        );

        console.log(
            "AUTH SERVICE: email =",
            dadosLogin.email
        );

        console.log(
            "AUTH SERVICE: senha =",
            dadosLogin.senha ? "***" : "(vazia)"
        );

        try {

            const response =
                await api.post<UsuarioResponseDTO>(
                    "/usuarios/login",
                    dadosLogin
                );

            console.log(
                "AUTH SERVICE: resposta recebida"
            );

            console.log(
                "AUTH SERVICE: status =",
                response.status
            );

            console.log(
                "AUTH SERVICE: dados =",
                response.data
            );

            return response.data;

        } catch (error: any) {

            console.error(
                "❌ AUTH SERVICE: erro no login"
            );

            console.error(
                "Erro completo:",
                error
            );

            console.error(
                "Mensagem:",
                error?.message
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Data:",
                error?.response?.data
            );

            throw error;
        }
    },

    cadastrar: async (
        dadosCadastro: CadastroDTO
    ): Promise<UsuarioResponseDTO> => {

        console.log(
            "AUTH SERVICE: iniciando cadastro"
        );

        console.log(
            "AUTH SERVICE: dados enviados:",
            {
                ...dadosCadastro,
                senha: "***"
            }
        );

        try {

            const response =
                await api.post<UsuarioResponseDTO>(
                    "/usuarios",
                    dadosCadastro
                );

            console.log(
                "AUTH SERVICE: cadastro realizado"
            );

            console.log(
                "Status:",
                response.status
            );

            console.log(
                "Usuário:",
                response.data
            );

            return response.data;

        } catch (error: any) {

            console.error(
                "❌ AUTH SERVICE: erro no cadastro"
            );

            console.error(
                "Erro completo:",
                error
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Resposta:",
                error?.response?.data
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

            console.log(
                "AUTH SERVICE: usuário já estava logado"
            );

            console.log(
                response.data
            );

            return response.data;

        } catch (error: any) {

            console.log(
                "AUTH SERVICE: nenhum usuário logado"
            );

            console.log(
                "Status:",
                error?.response?.status
            );

            throw error;
        }
    },

    logout: async () => {

        console.log(
            "AUTH SERVICE: fazendo logout..."
        );

        await api.post(
            "/usuarios/logout"
        );

        console.log(
            "AUTH SERVICE: logout realizado"
        );
    }
};