import type { Curso, Experiencia, Formacao, PerfilData } from './perfil';

export interface PerfilUsuario extends Partial<PerfilData> {
  local?: string;
  foto?: string;
  habilidades?: string[];
  sobre?: string;
  telefone?: string;
  instagram?: string;
  linkedin?: string;
  site?: string;
  github?: string;
  portfolio?: string;
  cidade?: string;
  biografia?: string;
  formacoes?: Formacao[];
  experiencias?: Experiencia[];
  cursos?: Curso[];
}

export interface UsuarioResponseDTO {
  id: number | string;
  nome?: string;
  email?: string;
  tipoUsuario?: string;
  perfil?: PerfilUsuario;
}

/**
 * Dados de perfil público autorizados para exibição (LGPD).
 * Nenhum dado confidencial (E-mail, Telefone, CPF, Senha) é exposto.
 */
export interface PerfilPublicoData {
  sobre?: string;
  local?: string;
  foto?: string;
  instagram?: string;
  linkedin?: string;
  site?: string;
  github?: string;
  portfolio?: string;
  cidade?: string;
  biografia?: string;
  habilidades?: string[];
  formacoes?: Formacao[];
  experiencias?: Experiencia[];
  cursos?: Curso[];
}

/**
 * Contrato de dados públicos (Tarefa 1 - LGPD)
 * Apenas informações públicas autorizadas para exibição no perfil.
 * Nenhum dado confidencial (E-mail, Telefone, CPF, Senha) é exposto.
 */
export interface UsuarioPublicoDTO {
  id?: number | string;
  nome?: string;
  foto?: string;
  biografia?: string;
  cidade?: string;
  local?: string;
  tipoUsuario?: string; // 'estudante' | 'empresa' | 'prestador'
  habilidades?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  site?: string;
  sobre?: string;
  perfil?: PerfilPublicoData;
}