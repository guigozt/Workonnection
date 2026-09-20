import { createContext } from 'react';
import type {UsuarioResponseDTO, LoginDTO} from '../types/auth';

export interface AuthContextData {
  usuario: UsuarioResponseDTO | null;
  loading: boolean;
  login: (dados: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextData | undefined>(
    undefined
  );