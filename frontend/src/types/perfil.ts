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

export interface ArquivoMetadados {
  id: string;
  tipoDocumento: string;
  nomeOriginal: string;
  contentType: string;
  tamanhoBytes: number;
  url: string;
  enviadoEm?: string;
}

export interface PerfilEstudante {
  instituicaoEnsino?: string;
  curso?: string;
  semestreAno?: string;
  previsaoConclusao?: string;
  turno?: string;
  matricula?: string;
  modalidadeInteresse?: string;
}

export interface PerfilMei {
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  ocupacaoPrincipal?: string;
  chavePix?: string;
  inscricaoMunicipal?: string;
  emiteNotaFiscal?: boolean;
}

export interface PerfilMe {
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnaePrincipal?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  regimeTributario?: string;
  porteEmpresa?: string;
  quantidadeFuncionarios?: number;
}

export interface PerfilEmpresa {
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  setorAtuacao?: string;
  tamanhoEmpresa?: string;
  siteOficial?: string;
  paginaCarreiras?: string;
  contatoRhEmail?: string;
  contatoRhTelefone?: string;
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

  fotoPerfil?: ArquivoMetadados;
  documentos?: ArquivoMetadados[];

  perfilEstudante?: PerfilEstudante;
  perfilMei?: PerfilMei;
  perfilMe?: PerfilMe;
  perfilEmpresa?: PerfilEmpresa;
}

export interface UsuarioPerfil {
  id?: string;
  nome: string;
  email: string;
  tipoUsuario?: string;
  foto?: string;
  perfil?: PerfilData;
}