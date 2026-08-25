export interface Formacao {
  universidade: string;
  curso: string;
  periodo: string;
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  descricao?: string;
}

export interface Curso {
  nome: string;
  instituicao: string;
  periodo: string;
}

export interface PerfilData {
  local?: string;
  telefone?: string;
  instagram?: string;
  linkedin?: string;
  site?: string;

  sobre?: string;

  habilidades?: string[];

  formacoes?: Formacao[];

  experiencias?: Experiencia[];

  cursos?: Curso[];
}

export interface UsuarioPerfil {
  nome: string;
  email: string;
  tipoUsuario?: string;
  foto?: string;
  perfil?: PerfilData;
}