import { api } from './api';
import type { Notificacao } from '../types/notificacao';

export const notificacaoService = {
  async listar(): Promise<Notificacao[]> {
    const response = await api.get<Notificacao[]>('/notificacoes');

    return response.data;
  },

  async marcarComoLida(id: number): Promise<void> {
    await api.patch(`/notificacoes/${id}/lida`);
  },

  async marcarTodasComoLidas(): Promise<void> {
    await api.patch('/notificacoes/lidas');
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/notificacoes/${id}`);
  },

  async excluirTodas(): Promise<void> {
    await api.delete('/notificacoes');
  },
};