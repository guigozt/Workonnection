import { api } from './api';
import type {
  FeedbackCreateDTO,
  FeedbackResponseDTO,
  StatusFeedbackCandidaturaDTO,
} from '../types/feedback';

export const feedbackService = {
  async enviarFeedback(
    candidaturaId: string,
    dto: FeedbackCreateDTO
  ): Promise<FeedbackResponseDTO> {
    const response = await api.post<FeedbackResponseDTO>(
      `/feedbacks/candidatura/${candidaturaId}`,
      dto
    );
    return response.data;
  },

  async listarFeedbacksDoPerfil(
    usuarioId: string,
    limite = 10
  ): Promise<FeedbackResponseDTO[]> {
    const response = await api.get<FeedbackResponseDTO[]>(
      `/feedbacks/usuario/${usuarioId}`,
      {
        params: { limite },
      }
    );
    return response.data;
  },

  async buscarStatusFeedback(
    candidaturaId: string
  ): Promise<StatusFeedbackCandidaturaDTO> {
    const response = await api.get<StatusFeedbackCandidaturaDTO>(
      `/feedbacks/candidatura/${candidaturaId}/status`
    );
    return response.data;
  },
};
