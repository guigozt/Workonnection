import type { UsuarioResponseDTO } from '../types/auth';

export interface ContaSalva {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: string;
  foto?: string;
  token?: string;
  ultimaVezEm: number;
}

const STORAGE_KEY = 'workonnection_contas_salvas';

export const contasManager = {
  obterContas: (): ContaSalva[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as ContaSalva[];
    } catch {
      return [];
    }
  },

  salvarConta: (usuario: UsuarioResponseDTO, token?: string) => {
    if (!usuario || !usuario.id) return;
    const contas = contasManager.obterContas();

    const fotoUrl =
      usuario.perfil?.fotoPerfil?.url ||
      usuario.foto ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        usuario.nome || 'User'
      )}&background=007B8A&color=fff`;

    const tokenFinal = token || localStorage.getItem('authToken') || '';

    const novaOuAtualizada: ContaSalva = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      foto: fotoUrl,
      token: tokenFinal,
      ultimaVezEm: Date.now(),
    };

    const filtradas = contas.filter((c) => c.id !== usuario.id);
    filtradas.unshift(novaOuAtualizada);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
  },

  removerConta: (id: string) => {
    const contas = contasManager.obterContas();
    const filtradas = contas.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
  },
};
