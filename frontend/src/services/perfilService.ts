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

  uploadFoto: async (arquivo: File) => {
    const formData = new FormData();
    formData.append('foto', arquivo);

    const response = await api.post<UsuarioPerfil>(
      '/usuarios/perfil/foto',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  uploadDocumento: async (tipoDocumento: string, arquivo: File) => {
    const formData = new FormData();
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('arquivo', arquivo);

    const response = await api.post<UsuarioPerfil>(
      '/usuarios/perfil/documentos',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};