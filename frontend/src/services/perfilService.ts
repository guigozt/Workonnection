import { api } from './api';
import type { PerfilData, UsuarioPerfil } from '../types/perfil';

export const perfilService = {
  buscar: async () => {
    const response = await api.get<UsuarioPerfil>('/usuarios/me');
    return response.data;
  },

  atualizar: async (perfil: PerfilData) => {
    const response = await api.put<UsuarioPerfil>(
      '/usuarios/perfil',
      perfil
    );

    return response.data;
  },
};