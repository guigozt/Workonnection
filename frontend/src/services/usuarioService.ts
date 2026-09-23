import { api } from './api';
import type { UsuarioPublicoDTO } from '../types/usuarios';

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
    const response = await api.post('/usuarios', payload);
    return response.data;
  },

  listarTodos: async (): Promise<UsuarioPublicoDTO[]> => {
    const { data } = await api.get('/usuarios');
    return data;
  },

  buscarPerfilPublico: async (id: string): Promise<UsuarioPublicoDTO> => {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  }
};