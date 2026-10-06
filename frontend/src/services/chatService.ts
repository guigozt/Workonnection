import { api } from './api';
import type { ConversaResumoDTO, MensagemResponseDTO } from '../types/chat';

export const chatService = {
  /**
   * Lista todas as conversas do usuário logado.
   */
  listarConversas: async (): Promise<ConversaResumoDTO[]> => {
    const { data } = await api.get<ConversaResumoDTO[]>('/conversas');
    return data;
  },

  /**
   * Obtém o histórico de mensagens entre o usuário logado e o contato.
   */
  obterMensagens: async (contatoId: string): Promise<MensagemResponseDTO[]> => {
    const { data } = await api.get<MensagemResponseDTO[]>(`/conversas/${contatoId}/mensagens`);
    return data;
  },

  /**
   * Envia uma mensagem para o contato.
   */
  enviarMensagem: async (contatoId: string, conteudo: string): Promise<MensagemResponseDTO> => {
    const { data } = await api.post<MensagemResponseDTO>(`/conversas/${contatoId}/mensagens`, {
      conteudo,
    });
    return data;
  },

  /**
   * Marca mensagens recebidas do contato como lidas.
   */
  marcarComoLida: async (contatoId: string): Promise<void> => {
    await api.put(`/conversas/${contatoId}/ler`);
  },

  /**
   * Obtém o total de mensagens não lidas do usuário.
   */
  obterTotalNaoLidas: async (): Promise<number> => {
    try {
      const { data } = await api.get<{ total: number }>('/conversas/nao-lidas/total');
      return data?.total || 0;
    } catch {
      return 0;
    }
  },

  /**
   * Edita o conteúdo de uma mensagem enviada pelo usuário logado.
   */
  editarMensagem: async (mensagemId: string, conteudo: string): Promise<MensagemResponseDTO> => {
    const { data } = await api.put<MensagemResponseDTO>(`/conversas/mensagens/${mensagemId}`, {
      conteudo,
    });
    return data;
  },

  /**
   * Exclui unilateralmente uma mensagem para o usuário logado.
   */
  excluirMensagem: async (mensagemId: string): Promise<void> => {
    await api.delete(`/conversas/mensagens/${mensagemId}`);
  },

  /**
   * Exclui unilateralmente todo o histórico da conversa com um contato.
   */
  excluirConversa: async (contatoId: string): Promise<void> => {
    await api.delete(`/conversas/${contatoId}`);
  },
};
