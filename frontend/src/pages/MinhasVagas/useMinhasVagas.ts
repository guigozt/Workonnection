import { useState, useEffect } from 'react';

import { vagaService } from '../../services/vagaService';

import { useAuth } from '../../context/AuthContext';

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
    carregarMinhasVagas();
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

  // Funções mockadas para não quebrar
  // as dependências do card,
  // já que na tela "Minhas Vagas"
  // o foco é visualização/edição rápida.

  const handleLike = () => {};

  const handleDislike = () => {};

  const handleEnviarComentario =
    async () => {};

  const handleExcluirComentario =
    async () => {};

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