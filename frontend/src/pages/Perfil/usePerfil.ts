import { useEffect, useState } from 'react';
import { perfilService } from '../../services/perfilService';
import type { ModalType } from '../../components/Perfil/PerfilModal';
import type {
  Curso,
  Experiencia,
  Formacao,
  PerfilData,
  PerfilEstudante,
  PerfilMei,
  PerfilMe,
  PerfilEmpresa,
  UsuarioPerfil,
} from '../../types/perfil';

export const usePerfil = () => {
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [perfil, setPerfil] = useState<PerfilData>({});
  const [loading, setLoading] = useState(true);
  const [carregandoFoto, setCarregandoFoto] = useState(false);

  const [modalAberto, setModalAberto] = useState<ModalType>(null);
  const [formacaoEditando, setFormacaoEditando] = useState<number | null>(null);
  const [experienciaEditando, setExperienciaEditando] = useState<number | null>(null);
  const [cursoEditando, setCursoEditando] = useState<number | null>(null);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const data = await perfilService.buscar();
      setUsuario(data);
      setPerfil(data.perfil || {});
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ativo = true;

    perfilService
      .buscar()
      .then((data) => {
        if (!ativo) return;
        setUsuario(data);
        setPerfil(data.perfil || {});
        setLoading(false);
      })
      .catch((error) => {
        if (!ativo) return;
        console.error('Erro ao carregar perfil:', error);
        setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const salvarPerfil = async (novoPerfil: PerfilData) => {
    try {
      const data = await perfilService.atualizar(novoPerfil);
      setUsuario((prev) => (prev ? { ...prev, perfil: data.perfil } : data));
      setPerfil(data.perfil || novoPerfil);
      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil.');
      return false;
    }
  };

  const uploadFoto = async (arquivo: File) => {
    try {
      setCarregandoFoto(true);
      const data = await perfilService.uploadFoto(arquivo);
      setUsuario(data);
      setPerfil(data.perfil || {});
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      alert('Erro ao atualizar foto de perfil.');
    } finally {
      setCarregandoFoto(false);
    }
  };

  const uploadDocumento = async (tipoDocumento: string, arquivo: File) => {
    try {
      const data = await perfilService.uploadDocumento(tipoDocumento, arquivo);
      setUsuario(data);
      setPerfil(data.perfil || {});
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      alert('Erro ao enviar documento comprobatório.');
    }
  };

  const salvarSubperfil = async (dados: {
    perfilEstudante?: PerfilEstudante;
    perfilMei?: PerfilMei;
    perfilMe?: PerfilMe;
    perfilEmpresa?: PerfilEmpresa;
  }) => {
    const novoPerfil: PerfilData = {
      ...perfil,
      ...dados,
    };
    if (await salvarPerfil(novoPerfil)) {
      fecharModal();
    }
  };

  const abrirModal = (modal: ModalType) => {
    setModalAberto(modal);
  };

  const fecharModal = () => {
    setModalAberto(null);
    setFormacaoEditando(null);
    setExperienciaEditando(null);
    setCursoEditando(null);
  };

  const atualizarContatos = async (
    novosContatos: Pick<
      PerfilData,
      'local' | 'telefone' | 'instagram' | 'linkedin' | 'site'
    >
  ) => {
    if (
      await salvarPerfil({
        ...perfil,
        ...novosContatos,
      })
    ) {
      fecharModal();
    }
  };

  const atualizarSobre = async (sobre: string) => {
    if (
      await salvarPerfil({
        ...perfil,
        sobre,
      })
    ) {
      fecharModal();
    }
  };

  const adicionarHabilidade = async (habilidade: string) => {
    const limpa = habilidade.trim();
    if (!limpa) return;

    const habilidades = [...(perfil.habilidades || [])];
    if (habilidades.includes(limpa)) {
      throw new Error('Habilidade já cadastrada.');
    }

    habilidades.push(limpa);

    if (
      await salvarPerfil({
        ...perfil,
        habilidades,
      })
    ) {
      fecharModal();
    }
  };

  const excluirHabilidade = async (index: number) => {
    const habilidades = [...(perfil.habilidades || [])];
    habilidades.splice(index, 1);

    await salvarPerfil({
      ...perfil,
      habilidades,
    });
  };

  const adicionarFormacao = async (formacao: Formacao) => {
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

  const adicionarExperiencia = async (experiencia: Experiencia) => {
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

  const adicionarCurso = async (curso: Curso) => {
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
    if (!window.confirm('Isso apagará todos os dados do perfil. Tem certeza?')) {
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
    carregandoFoto,

    modalAberto,
    abrirModal,
    fecharModal,

    formacaoEditando,
    experienciaEditando,
    cursoEditando,

    setFormacaoEditando,
    setExperienciaEditando,
    setCursoEditando,

    uploadFoto,
    uploadDocumento,
    salvarSubperfil,

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