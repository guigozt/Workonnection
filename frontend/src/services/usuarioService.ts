import { api } from './api';

export interface CadastroPayLoad {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    senha: string;
    tipoUsuario: string;
}

export const usuarioService = {

    cadastrar: async (payload: CadastroPayLoad) => {

        const response =
            await api.post(
                '/usuarios',
                payload
            );

        return response.data;
    }
};