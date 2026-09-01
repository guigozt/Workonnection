import { useState, useEffect } from 'react';
import type { VagaResponseDTO, UsuarioLogado } from '../../types/vagas';
import { api } from '../../services/api'

export const useHome = () => {
  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vagaEmEdicao, setVagaEmEdicao] = useState<VagaResponseDTO | null>(null);
  const [usuarioLogado] = useState<UsuarioLogado | null>(null);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const res = await api.get<VagaResponseDTO[]>('/vagas');
      setVagas(res.data);
    } catch (err) {
      console.error('Erro ao carregar vagas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  const handleAbrirCriacao = () => {
    setVagaEmEdicao(null);
    setIsModalOpen(true);
  };

  const handleAbrirEdicao = (vaga: VagaResponseDTO) => {
    setVagaEmEdicao(vaga);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setVagaEmEdicao(null);
  };

  const handleSalvarVagaSucesso = (vagaSalva: VagaResponseDTO) => {
    setVagas((prev) => {
      const existe = prev.some((v) => v.id === vagaSalva.id);
      if (existe) {
        return prev.map((v) => (v.id === vagaSalva.id ? vagaSalva : v));
      }
      return [vagaSalva, ...prev];
    });
  };

const handleExcluirVaga = async (vagaId: string, cargo: string) => {
    if (!window.confirm(`Deseja realmente excluir a vaga de "${cargo}"?`)) return;
    try {
      await api.delete(`/vagas/${vagaId}`);
      setVagas((prev) => prev.filter((v) => v.id !== vagaId));
    } catch (err) {
      console.error('Erro ao excluir vaga:', err);
    }
  };

  const handleLike = async (vagaId: string) => {
    try {
      const res = await api.post<VagaResponseDTO>(`/vagas/${vagaId}/like`);
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? res.data : v)));
    } catch (err) {
      console.error('Erro ao dar like:', err);
    }
  };

  const handleDislike = async (vagaId: string) => {
    try {
      const res = await api.post<VagaResponseDTO>(`/vagas/${vagaId}/dislike`);
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? res.data : v)));
    } catch (err) {
      console.error('Erro ao dar dislike:', err);
    }
  };

  const handleEnviarComentario = async (vagaId: string, texto: string) => {
    try {
      const res = await api.post<VagaResponseDTO>(`/vagas/${vagaId}/comentarios`, { texto });
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? res.data : v)));
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
    }
  };

  const handleExcluirComentario = async (vagaId: string, comentarioId: string) => {
    try {
      const res = await api.delete<VagaResponseDTO>(`/vagas/${vagaId}/comentarios/${comentarioId}`);
      setVagas((prev) => prev.map((v) => (v.id === vagaId ? res.data : v)));
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
    }
  };

  return {
    vagas,
    loading,
    usuarioLogado,
    isModalOpen,
    vagaEmEdicao,
    handleAbrirCriacao,
    handleAbrirEdicao,
    handleFecharModal,
    handleSalvarVagaSucesso,
    handleExcluirVaga,
    handleLike,
    handleDislike,
    handleEnviarComentario,
    handleExcluirComentario,
  };
};