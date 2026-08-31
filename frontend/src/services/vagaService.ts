import { api } from './api';
import type { VagaDTO, VagaResponseDTO } from '../types/vagas';

export const vagaService = {
    // ... suas outras funções (listar, criar, editar, etc)

    listarMinhas: async () => {
        const response = await api.get<VagaResponseDTO[]>('/vagas/minhas');
        return response.data;
    },

    excluir: async (id: string): Promise<void> => {
        await api.delete(`/vagas/${id}`);
    }

};
