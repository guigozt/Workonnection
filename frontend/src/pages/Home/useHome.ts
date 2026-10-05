import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { VagaResponseDTO, UsuarioLogado } from '../../types/vagas';
import { vagaService, type FiltrosVagaParams } from '../../services/vagaService';
import { useAuth } from '../../context/useAuth';

export const useHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { usuario } = useAuth();

  const usuarioLogado: UsuarioLogado | null = usuario
    ? { id: usuario.id, nomeUsuario: usuario.nome, tipoUsuario: usuario.tipoUsuario }
    : null;

  // Estados dos filtros
  const [busca, setBusca] = useState<string>(() => searchParams.get('busca') || '');
  const [buscaDebounced, setBuscaDebounced] = useState<string>(() => searchParams.get('busca') || '');
  const [modalidade, setModalidade] = useState<string>(() => searchParams.get('modalidade') || 'Todos');
  const [tipo, setTipo] = useState<string>(() => searchParams.get('tipo') || 'Todos');

  // Estados de dados e modal
  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vagaEmEdicao, setVagaEmEdicao] = useState<VagaResponseDTO | null>(null);

  // Debounce de 400ms para o campo de texto da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaDebounced(busca);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [busca]);

  // Sincronização com query params da URL (ex: /home?busca=react&modalidade=Remoto)
  useEffect(() => {
    const params: Record<string, string> = {};
    if (buscaDebounced.trim()) params.busca = buscaDebounced.trim();
    if (modalidade && modalidade !== 'Todos') params.modalidade = modalidade;
    if (tipo && tipo !== 'Todos') params.tipo = tipo;

    setSearchParams(params, { replace: true });
  }, [buscaDebounced, modalidade, tipo, setSearchParams]);

  // Carregamento de vagas com os filtros aplicados
  useEffect(() => {
    let ativo = true;

    const params: FiltrosVagaParams = {};
    if (buscaDebounced.trim()) {
      params.busca = buscaDebounced.trim();
    }
    if (modalidade && modalidade !== 'Todos') {
      params.modalidade = modalidade;
    }
    if (tipo && tipo !== 'Todos') {
      params.tipo = tipo;
    }

    vagaService
      .listarTodas(params)
      .then((data) => {
        if (!ativo) return;
        setVagas(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!ativo) return;
        console.error('Erro ao carregar vagas:', err);
        setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [buscaDebounced, modalidade, tipo]);

  const handleBuscaChange = (valor: string) => {
    setBusca(valor);
    setLoading(true);
  };

  const handleModalidadeChange = (valor: string) => {
    setModalidade(valor);
    setLoading(true);
  };

  const handleTipoChange = (valor: string) => {
    setTipo(valor);
    setLoading(true);
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setBuscaDebounced('');
    setModalidade('Todos');
    setTipo('Todos');
    setLoading(true);
  };

  const temFiltrosAtivos = Boolean(
    busca.trim() ||
    (modalidade && modalidade !== 'Todos') ||
    (tipo && tipo !== 'Todos')
  );

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
      await vagaService.excluir(vagaId);
      setVagas((prev) => prev.filter((v) => v.id !== vagaId));
    } catch (err) {
      console.error('Erro ao excluir vaga:', err);
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
    usuarioLogado,
    isModalOpen,
    vagaEmEdicao,
    busca,
    setBusca: handleBuscaChange,
    modalidade,
    setModalidade: handleModalidadeChange,
    tipo,
    setTipo: handleTipoChange,
    handleLimparFiltros,
    temFiltrosAtivos,
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