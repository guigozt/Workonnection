import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';

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

  const login = async (dados: LoginDTO) => {
    console.log('AUTH: executando login...', dados.email);
    const user = await authService.login(dados);
    console.log('AUTH: login retornou:', user);
    setUsuario(user);
  };

  const loginComGoogleToken = async (token: string): Promise<UsuarioResponseDTO> => {
    console.log('AUTH: executando login com Google...');
    const user = await authService.loginComGoogleToken(token);
    console.log('AUTH: login com Google retornou:', user);
    setUsuario(user);
    return user;
  };

  const completarCadastro = async (dados: CompletarCadastroDTO): Promise<UsuarioResponseDTO> => {
    console.log('AUTH: executando cadastro...', dados);
    const user = await authService.completarCadastro(dados);
    console.log('AUTH: cadastro retornou:', user);
    setUsuario(user);
    return user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      console.error('Erro na API ao deslogar. Limpando estado local mesmo assim.');
    } finally {
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        logout,
        loginComGoogleToken,
        completarCadastro
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};