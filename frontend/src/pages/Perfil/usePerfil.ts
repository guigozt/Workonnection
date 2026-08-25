import { useEffect, useState } from 'react';

import {
  atualizarPerfil,
  buscarPerfil,
} from '../../services/perfilService';

import type {
  Curso,
  Experiencia,
  Formacao,
  PerfilData,
  UsuarioPerfil,
} from '../../types/perfil';

type ModalType =
  | 'contatos'
  | 'sobre'
  | 'habilidade'
  | 'formacao'
  | 'experiencia'
  | 'curso'
  | null;

export const usePerfil = () => {
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [perfil, setPerfil] = useState<PerfilData>({});

  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState<ModalType>(null);

  const [formacaoEditando, setFormacaoEditando] =
    useState<number | null>(null);

  const [experienciaEditando, setExperienciaEditando] =
    useState<number | null>(null);

  const [cursoEditando, setCursoEditando] =
    useState<number | null>(null);

  const carregarPerfil = async () => {
    try {
      setLoading(true);

      const data = await buscarPerfil();

      setUsuario(data);
      setPerfil(data.perfil || {});
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const salvarPerfil = async (novoPerfil: PerfilData) => {
    try {
      const data = await atualizarPerfil(novoPerfil);

      setPerfil(data.perfil || novoPerfil);

      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);

      alert('Erro ao salvar perfil.');

      return false;
    }
  };

  const abrirModal = (modal: ModalType) => {
    setModalAberto(modal);
  };

  const fecharModal = () => {
    setModalAberto(null);
  };

  const atualizarContatos = async (
    dados: Pick<
      PerfilData,
      'local' | 'telefone' | 'instagram' | 'linkedin' | 'site'
    >
  ) => {
    const novoPerfil = {
      ...perfil,
      ...dados,
    };

    if (await salvarPerfil(novoPerfil)) {
      fecharModal();
    }
  };

  const atualizarSobre = async (sobre: string) => {
    const novoPerfil = {
      ...perfil,
      sobre,
    };

    if (await salvarPerfil(novoPerfil)) {
      fecharModal();
    }
  };

  const adicionarHabilidade = async (habilidade: string) => {
    const habilidades = perfil.habilidades || [];

    const existente = habilidades.some(
      (item) => item.toLowerCase() === habilidade.toLowerCase()
    );

    if (existente) {
      throw new Error('Já adicionada.');
    }

    const novoPerfil: PerfilData = {
      ...perfil,
      habilidades: [...habilidades, habilidade],
    };

    if (await salvarPerfil(novoPerfil)) {
      fecharModal();
    }
  };

  const excluirHabilidade = async (index: number) => {
    const habilidades = [...(perfil.habilidades || [])];

    const habilidade = habilidades[index];

    if (
      !window.confirm(`Excluir "${habilidade}"?`)
    ) {
      return;
    }

    habilidades.splice(index, 1);

    await salvarPerfil({
      ...perfil,
      habilidades,
    });
  };

  const adicionarFormacao = async (
    formacao: Formacao
  ) => {
    const formacoes = [...(perfil.formacoes || [])];

    if (formacaoEditando !== null) {
      formacoes[formacaoEditando] = formacao;
    } else {
      formacoes.push(formacao);
    }

    if (
      await salvarPerfil({
        ...perfil,
        formacoes,
      })
    ) {
      setFormacaoEditando(null);
      fecharModal();
    }
  };

  const excluirFormacao = async (index: number) => {
    if (!window.confirm('Excluir formação?')) {
      return;
    }

    const formacoes = [...(perfil.formacoes || [])];

    formacoes.splice(index, 1);

    await salvarPerfil({
      ...perfil,
      formacoes,
    });
  };

  const adicionarExperiencia = async (
    experiencia: Experiencia
  ) => {
    const experiencias = [...(perfil.experiencias || [])];

    if (experienciaEditando !== null) {
      experiencias[experienciaEditando] = experiencia;
    } else {
      experiencias.push(experiencia);
    }

    if (
      await salvarPerfil({
        ...perfil,
        experiencias,
      })
    ) {
      setExperienciaEditando(null);
      fecharModal();
    }
  };

  const excluirExperiencia = async (index: number) => {
    if (!window.confirm('Excluir experiência?')) {
      return;
    }

    const experiencias = [...(perfil.experiencias || [])];

    experiencias.splice(index, 1);

    await salvarPerfil({
      ...perfil,
      experiencias,
    });
  };

  const adicionarCurso = async (
    curso: Curso
  ) => {
    const cursos = [...(perfil.cursos || [])];

    if (cursoEditando !== null) {
      cursos[cursoEditando] = curso;
    } else {
      cursos.push(curso);
    }

    if (
      await salvarPerfil({
        ...perfil,
        cursos,
      })
    ) {
      setCursoEditando(null);
      fecharModal();
    }
  };

  const excluirCurso = async (index: number) => {
    if (!window.confirm('Excluir curso?')) {
      return;
    }

    const cursos = [...(perfil.cursos || [])];

    cursos.splice(index, 1);

    await salvarPerfil({
      ...perfil,
      cursos,
    });
  };

  const editarFormacao = (index: number) => {
    setFormacaoEditando(index);
    abrirModal('formacao');
  };

  const editarExperiencia = (index: number) => {
    setExperienciaEditando(index);
    abrirModal('experiencia');
  };

  const editarCurso = (index: number) => {
    setCursoEditando(index);
    abrirModal('curso');
  };

  const resetarPerfil = async () => {
    if (
      !window.confirm(
        'Isso apagará todos os dados do perfil. Tem certeza?'
      )
    ) {
      return;
    }

    if (await salvarPerfil({})) {
      await carregarPerfil();
    }
  };

  return {
    usuario,
    perfil,
    loading,

    modalAberto,
    abrirModal,
    fecharModal,

    formacaoEditando,
    experienciaEditando,
    cursoEditando,

    setFormacaoEditando,
    setExperienciaEditando,
    setCursoEditando,

    atualizarContatos,
    atualizarSobre,

    adicionarHabilidade,
    excluirHabilidade,

    adicionarFormacao,
    editarFormacao,
    excluirFormacao,

    adicionarExperiencia,
    editarExperiencia,
    excluirExperiencia,

    adicionarCurso,
    editarCurso,
    excluirCurso,

    resetarPerfil,
  };
};