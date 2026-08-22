import { useState, useEffect } from 'react';
import type { VagaResponseDTO } from '../../types/vagas';
import { type VagaData } from '../../components/ModalVaga/ModalVaga';

export const useHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vagaEmEdicao, setVagaEmEdicao] = useState<VagaData | null>(null);
  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/vagas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data: VagaResponseDTO[] = await response.json();
        setVagas(data);
      } else {
        console.error('Erro ao carregar vagas: ', response.statusText);
      }
    } catch (error) {
      console.error('Erro de rede ao buscar vagas', error);
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

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setVagaEmEdicao(null);
  };

  const handleSalvarVagaSucesso = () => {
    handleFecharModal();
    carregarVagas(); // Atualiza a lista após criar/editar
  };

  return {
    vagas,
    loading,
    isModalOpen,
    vagaEmEdicao,
    handleAbrirCriacao,
    handleFecharModal,
    handleSalvarVagaSucesso,
    carregarVagas,
  };
};