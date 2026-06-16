import { api } from "./api";
import type { LoginDTO, CadastroDTO, UsuarioResponseDTO } from '../types/auth';

export const authService = {
    login: async (dadosLogin: LoginDTO) => {
        const response = await api.post<UsuarioResponseDTO>('/usuarios/login', dadosLogin);
        return response.data;
    },

    cadastrar: async (dadosCadastro: CadastroDTO) => {
        const response = await api.post<UsuarioResponseDTO>('/usuarios', dadosCadastro);
        return response.data;
    },

    buscarUsuarioLogado: async () => {
        const response = await api.get<UsuarioResponseDTO>('/usuarios/me');
        return response.data;
    },

    logout: async () => {
        await api.post('/usuarios/logout');
    }
};
