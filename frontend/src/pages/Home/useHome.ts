import { useState, useEffect } from 'react';
import type { VagaResponseDTO, UsuarioLogado } from '../../types/vagas';

export const useHome = () => {
  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vagaEmEdicao, setVagaEmEdicao] = useState<VagaResponseDTO | null>(null);
  const [usuarioLogado] = useState<UsuarioLogado | null>(null);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/vagas', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data: VagaResponseDTO[] = await res.json();
        setVagas(data);
      } else {
        console.error(`Erro ${res.status}: Não foi possível carregar as vagas.`);
      }
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
      const res = await fetch(`http://localhost:8080/vagas/${vagaId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setVagas((prev) => prev.filter((v) => v.id !== vagaId));
      }
    } catch (err) {
      console.error('Erro ao excluir vaga:', err);
    }
  };

  const handleLike = async (vagaId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/vagas/${vagaId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const vagaAtualizada: VagaResponseDTO = await res.json();
        setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
      }
    } catch (err) {
      console.error('Erro ao dar like:', err);
    }
  };

  const handleDislike = async (vagaId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/vagas/${vagaId}/dislike`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const vagaAtualizada: VagaResponseDTO = await res.json();
        setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
      }
    } catch (err) {
      console.error('Erro ao dar dislike:', err);
    }
  };

  const handleEnviarComentario = async (vagaId: string, texto: string) => {
    try {
      const res = await fetch(`http://localhost:8080/vagas/${vagaId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ texto }),
      });
      if (res.ok) {
        const vagaAtualizada: VagaResponseDTO = await res.json();
        setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
      }
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
    }
  };

  const handleExcluirComentario = async (vagaId: string, comentarioId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/vagas/${vagaId}/comentarios/${comentarioId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const vagaAtualizada: VagaResponseDTO = await res.json();
        setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
      }
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