import { createContext } from 'react';
import type { UsuarioResponseDTO, LoginDTO, CompletarCadastroDTO } from '../types/auth';

export interface AuthContextData {
  usuario: UsuarioResponseDTO | null;
  loading: boolean;
  login: (dados: LoginDTO) => Promise<void>;
  loginComGoogleToken: (token: string) => Promise<UsuarioResponseDTO>;
  completarCadastro: (dados: CompletarCadastroDTO) => Promise<UsuarioResponseDTO>;
  logout: () => Promise<void>;
  atualizarConfiguracoes: (dados: { tema?: string; idioma?: string }) => Promise<void>;
  excluirConta: () => Promise<void>;
  setUsuario: (usuario: UsuarioResponseDTO | null) => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);
