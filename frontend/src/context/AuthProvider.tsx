import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';
import { contasManager } from '../utils/contasManager';

import type {
  UsuarioResponseDTO,
  LoginDTO,
  CompletarCadastroDTO,
} from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<UsuarioResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Sincroniza tema e idioma no documento
  useEffect(() => {
    const temaSalvo = usuario?.configuracoes?.tema || localStorage.getItem('workonnection_tema') || 'claro';
    const idiomaSalvo = usuario?.configuracoes?.idioma || localStorage.getItem('workonnection_idioma') || 'pt-BR';

    if (temaSalvo === 'escuro') {
      document.documentElement.setAttribute('data-tema', 'escuro');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-tema', 'claro');
      document.body.classList.remove('dark-mode');
    }

    document.documentElement.setAttribute('lang', idiomaSalvo);
    localStorage.setItem('workonnection_tema', temaSalvo);
    localStorage.setItem('workonnection_idioma', idiomaSalvo);

    if (usuario) {
      contasManager.salvarConta(usuario);
    }
  }, [usuario]);

  useEffect(() => {
    console.log('AUTH: verificando usuário logado...');

    authService
      .buscarUsuarioLogado()
      .then((user) => {
        console.log('AUTH: usuário encontrado:', user);
        setUsuario(user);
      })
      .catch((error) => {
        console.log('AUTH: nenhum usuário logado', error);
        setUsuario(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (dados: LoginDTO) => {
    console.log('AUTH: executando login...', dados.email);
    const user = await authService.login(dados);
    console.log('AUTH: login retornou:', user);
    setUsuario(user);
    contasManager.salvarConta(user);
  }, []);

  const loginComGoogleToken = useCallback(async (token: string): Promise<UsuarioResponseDTO> => {
    console.log('AUTH: executando login com Google...');
    const user = await authService.loginComGoogleToken(token);
    console.log('AUTH: login com Google retornou:', user);
    setUsuario(user);
    contasManager.salvarConta(user);
    return user;
  }, []);

  const completarCadastro = useCallback(async (dados: CompletarCadastroDTO): Promise<UsuarioResponseDTO> => {
    console.log('AUTH: executando cadastro...', dados);
    const user = await authService.completarCadastro(dados);
    console.log('AUTH: cadastro retornou:', user);
    setUsuario(user);
    contasManager.salvarConta(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      console.error('Erro na API ao deslogar. Limpando estado local mesmo assim.');
    } finally {
      setUsuario(null);
    }
  }, []);

  const atualizarConfiguracoes = useCallback(async (dados: { tema?: string; idioma?: string }) => {
    try {
      const atualizado = await authService.atualizarConfiguracoes(dados);
      setUsuario(atualizado);
    } catch (error) {
      console.error('Erro ao atualizar configurações no backend:', error);
      // Atualiza no estado local mesmo se der erro
      setUsuario((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          configuracoes: {
            ...prev.configuracoes,
            ...dados,
          },
        };
      });
    }
  }, []);

  const excluirConta = useCallback(async () => {
    try {
      await authService.excluirConta();
    } finally {
      setUsuario(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        logout,
        loginComGoogleToken,
        completarCadastro,
        atualizarConfiguracoes,
        excluirConta,
        setUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};