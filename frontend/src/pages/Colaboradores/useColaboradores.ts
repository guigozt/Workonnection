import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService';
import { useAuth } from '../../context/AuthContext';
import type { UsuarioResponseDTO } from '../../types/usuarios';

export const useColaboradores = () => {
  const { usuario: usuarioLogado } = useAuth();

  const [colaboradores, setColaboradores] = useState<
    UsuarioResponseDTO[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [isCompacto, setIsCompacto] = useState(false);

  useEffect(() => {
    const carregarColaboradores = async () => {
      try {
        setLoading(true);

        const data = await usuarioService.listarTodos();

        // Remove o usuário logado da lista
        const listaFiltrada = data.filter(
          (c) => c.id !== usuarioLogado?.id
        );

        setColaboradores(listaFiltrada);
      } catch (error) {
        console.error(
          'Erro ao carregar colaboradores:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    carregarColaboradores();
  }, [usuarioLogado]);

  return {
    colaboradores,
    loading,
    isCompacto,
    setIsCompacto,
  };
};