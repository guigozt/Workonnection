export type StatusCandidatura =
  | 'INSCRITO'
  | 'EM_CHAT'
  | 'ALINHAMENTO_FINAL'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'RECUSADO';

export interface FeedbackSelecao {
  motivoPrincipal: string;
  competenciasMelhoria?: string[];
  pontosFortes?: string[];
  dicaConstrutiva?: string;
  enviadoEm?: string;
}

export interface CandidaturaCreateDTO {
  mensagemApresentacao?: string;
}

export interface FeedbackRecusaDTO {
  motivoPrincipal: string;
  competenciasMelhoria?: string[];
  pontosFortes?: string[];
  dicaConstrutiva?: string;
}

export interface StatusUpdateDTO {
  status: StatusCandidatura;
}

export interface CandidaturaResponseDTO {
  id: string;
  vagaId: string;
  candidatoId: string;
  tipoCandidato?: string;
  contratanteId: string;
  status: StatusCandidatura;
  mensagemApresentacao?: string;
  feedbackSelecao?: FeedbackSelecao;
  criadaEm: string;
  atualizadaEm: string;

  // Dados complementares da Vaga
  vagaCargo?: string;
  vagaEmpresa?: string;
  vagaModalidade?: string;
  vagaSalario?: string;
  vagaLocalizacao?: string;

  // Dados complementares do Candidato
  candidatoNome?: string;
  candidatoEmail?: string;
  candidatoFotoUrl?: string;
  candidatoHabilidades?: string[];
  candidatoSobre?: string;
}
