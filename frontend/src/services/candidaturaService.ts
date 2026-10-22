import { api } from './api';
import type {
  CandidaturaResponseDTO,
  CandidaturaCreateDTO,
  FeedbackRecusaDTO,
  StatusCandidatura,
} from '../types/candidatura';

export const candidaturaService = {
  async candidatar(
    vagaId: string,
    dto?: CandidaturaCreateDTO
  ): Promise<CandidaturaResponseDTO> {
    const response = await api.post<CandidaturaResponseDTO>(
      `/candidaturas/vaga/${vagaId}`,
      dto || {}
    );
    return response.data;
  },

  async listarMinhas(): Promise<CandidaturaResponseDTO[]> {
    const response = await api.get<CandidaturaResponseDTO[]>('/candidaturas/minhas');
    return response.data;
  },

  async gerenciarRecebidas(vagaId?: string): Promise<CandidaturaResponseDTO[]> {
    const params = vagaId ? { vagaId } : undefined;
    const response = await api.get<CandidaturaResponseDTO[]>('/candidaturas/gerenciar', {
      params,
    });
    return response.data;
  },

  async buscarPorId(id: string): Promise<CandidaturaResponseDTO> {
    const response = await api.get<CandidaturaResponseDTO>(`/candidaturas/${id}`);
    return response.data;
  },

  async atualizarStatus(
    id: string,
    status: StatusCandidatura
  ): Promise<CandidaturaResponseDTO> {
    const response = await api.patch<CandidaturaResponseDTO>(
      `/candidaturas/${id}/status`,
      { status }
    );
    return response.data;
  },

  async recusarComFeedback(
    id: string,
    feedback: FeedbackRecusaDTO
  ): Promise<CandidaturaResponseDTO> {
    const response = await api.post<CandidaturaResponseDTO>(
      `/candidaturas/${id}/recusar`,
      feedback
    );
    return response.data;
  },
};
