import { api } from './api';
import type { UsuarioResponseDTO } from '../types/usuarios';

export const usuarioService = {
  listarTodos: async (): Promise<UsuarioResponseDTO[]> => {
    const { data } = await api.get('/usuarios');
    return data;
  },
};