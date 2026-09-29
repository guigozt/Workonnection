import { api } from './api';
import type { VagaDTO, VagaResponseDTO } from '../types/vagas';

export interface FiltrosVagaParams {
  busca?: string;
  tipo?: string;
  modalidade?: string;
}

export const vagaService = {
  listarTodas: async (filtros?: FiltrosVagaParams) => {
    const response = await api.get<VagaResponseDTO[]>('/vagas', { params: filtros });
    return response.data;
  },

  listarMinhas: async () => {
    const response = await api.get<VagaResponseDTO[]>('/vagas/minhas');
    return response.data;
  },

  criar: async (vaga: VagaDTO) => {
    const response = await api.post<VagaResponseDTO>('/vagas', vaga);
    return response.data;
  },

  darLike: async (id: string) => {
    const response = await api.post<VagaResponseDTO>(`/vagas/${id}/like`);
    return response.data;
  },

  darDislike: async (id: string) => {
    const response = await api.post<VagaResponseDTO>(`/vagas/${id}/dislike`);
    return response.data;
  },

  comentar: async (id: string, comentario: { texto: string }) => {
    const response = await api.post<VagaResponseDTO>(
      `/vagas/${id}/comentarios`,
      comentario
    );
    return response.data;
  },

  excluirComentario: async (vagaId: string, comentarioId: string) => {
    const response = await api.delete<VagaResponseDTO>(
      `/vagas/${vagaId}/comentarios/${comentarioId}`
    );
    return response.data;
  },

  excluir: async (id: string) => {
    const response = await api.delete(`/vagas/${id}`);
    return response.data;
  },
};