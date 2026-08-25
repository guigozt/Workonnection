import type { PerfilData, UsuarioPerfil } from '../types/perfil';

const API_URL = 'http://localhost:8080';

export const buscarPerfil = async (): Promise<UsuarioPerfil> => {
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar o perfil.');
  }

  return response.json();
};

export const atualizarPerfil = async (
  perfil: PerfilData
): Promise<UsuarioPerfil> => {
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(perfil),
  });

  if (!response.ok) {
    throw new Error('Não foi possível salvar o perfil.');
  }

  return response.json();
};