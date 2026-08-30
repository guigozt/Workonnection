import { useEffect, useState } from 'react';
import { notificacaoService } from '../../services/notificacaoService';
import type { Notificacao } from '../../types/notificacao';

export const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarNotificacoes = async () => {
    try {
      setErro(null);

      const lista = await notificacaoService.listar();

      setNotificacoes(lista);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);

      setErro('Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (id: string) => {
    try {
      await notificacaoService.marcarComoLida(id);

      setNotificacoes((notificacoesAtuais) =>
        notificacoesAtuais.map((notificacao) =>
          notificacao.id === id
            ? {
                ...notificacao,
                lida: true,
              }
            : notificacao
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      await notificacaoService.marcarTodasComoLidas();

      setNotificacoes((notificacoesAtuais) =>
        notificacoesAtuais.map((notificacao) => ({
          ...notificacao,
          lida: true,
        }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const excluirNotificacao = async (id: string) => {
    try {
      await notificacaoService.excluir(id);

      setNotificacoes((notificacoesAtuais) =>
        notificacoesAtuais.filter(
          (notificacao) => notificacao.id !== id
        )
      );
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const limparTodas = async () => {
    try {
      await notificacaoService.excluirTodas();

      setNotificacoes([]);
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  const quantidadeNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  return {
    notificacoes,
    loading,
    erro,
    quantidadeNaoLidas,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
    limparTodas,
  };
};