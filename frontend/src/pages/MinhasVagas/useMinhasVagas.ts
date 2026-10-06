import { useState, useEffect } from 'react';

import { vagaService } from '../../services/vagaService';

import { useAuth } from '../../context/useAuth';

import type { VagaResponseDTO } from '../../types/vagas';

export const useMinhasVagas = () => {
  const { usuario } = useAuth();

  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [vagaEmEdicao, setVagaEmEdicao] =
    useState<VagaResponseDTO | undefined>(
      undefined
    );

  const carregarMinhasVagas = async () => {
    try {
      setLoading(true);

      const data =
        await vagaService.listarMinhas();

      setVagas(data);
    } catch (error) {
      console.error(
        'Erro ao carregar minhas vagas:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ativo = true;

    vagaService
      .listarMinhas()
      .then((data) => {
        if (!ativo) return;

        setVagas(data);
        setLoading(false);
      })
      .catch((error) => {
        if (!ativo) return;

        console.error(
          'Erro ao carregar minhas vagas:',
          error
        );

        setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const handleAbrirCriacao = (
    vaga?: VagaResponseDTO
  ) => {
    setVagaEmEdicao(vaga);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setVagaEmEdicao(undefined);
    setIsModalOpen(false);
  };

  const handleSalvarVagaSucesso = () => {
    handleFecharModal();
    carregarMinhasVagas();
  };

  const handleExcluirVaga = async (
    vagaId: string,
    cargo: string
  ) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a vaga para ${cargo}?`
      )
    ) {
      try {
        await vagaService.excluir(vagaId);

        // Remove da tela
        setVagas(
          vagas.filter(
            (v) => v.id !== vagaId
          )
        );
      } catch (error) {
        console.error(
          'Erro ao excluir vaga:',
          error
        );

        alert(
          'Erro ao excluir vaga. Tente novamente.'
        );
      }
    }
  };

  const handleLike = async (vagaId: string) => {
    try {
      const vagaAtualizada = await vagaService.darLike(vagaId);
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
    } catch (err) {
      console.error('Erro ao dar like:', err);
    }
  };

  const handleDislike = async (vagaId: string) => {
    try {
      const vagaAtualizada = await vagaService.darDislike(vagaId);
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
    } catch (err) {
      console.error('Erro ao dar dislike:', err);
    }
  };

  const handleEnviarComentario = async (vagaId: string, texto: string) => {
    try {
      const vagaAtualizada = await vagaService.comentar(vagaId, { texto });
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      throw err;
    }
  };

  const handleExcluirComentario = async (vagaId: string, comentarioId: string) => {
    try {
      const vagaAtualizada = await vagaService.excluirComentario(vagaId, comentarioId);
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
      throw err;
    }
  };

  return {
    vagas,
    loading,
    usuarioLogado: usuario,

    isModalOpen,
    vagaEmEdicao,

    handleAbrirCriacao,
    handleFecharModal,
    handleSalvarVagaSucesso,
    handleExcluirVaga,

    handleLike,
    handleDislike,

    handleEnviarComentario,
    handleExcluirComentario,
  };
};