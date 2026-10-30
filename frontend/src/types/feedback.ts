export interface FeedbackCreateDTO {
  notaGeral?: number;
  motivoPrincipal?: string;
  competenciasMelhoria?: string[];
  pontosFortes?: string[];
  dicaConstrutiva?: string;
  avaliacaoProcesso?: string;
  avaliacaoEmpresa?: string;
  clarezaRequisitos?: number;
  comunicacaoContratante?: number;
}

export interface FeedbackResponseDTO {
  id: string;
  candidaturaId: string;
  vagaId: string;
  tituloVaga: string;
  autorId: string;
  autorNome: string;
  autorFotoUrl?: string;
  autorTipo: string;
  destinatarioId: string;
  tipoAutor: 'CONTRATANTE' | 'CANDIDATO';
  decisao: 'ACEITO' | 'RECUSADO';
  notaGeral?: number;

  // Contratante
  motivoPrincipal?: string;
  competenciasMelhoria?: string[];
  pontosFortes?: string[];
  dicaConstrutiva?: string;

  // Candidato
  avaliacaoProcesso?: string;
  avaliacaoEmpresa?: string;
  clarezaRequisitos?: number;
  comunicacaoContratante?: number;

  criadoEm: string;
}

export interface StatusFeedbackCandidaturaDTO {
  contratanteEnviou: boolean;
  candidatoEnviou: boolean;
  meuFeedback?: FeedbackResponseDTO | null;
  feedbackRecebido?: FeedbackResponseDTO | null;
}
