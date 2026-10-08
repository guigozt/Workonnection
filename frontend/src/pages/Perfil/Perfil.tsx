import React from 'react';

import { Topbar } from '../../components/Topbar/Topbar';

import { PerfilHeader } from '../../components/Perfil/PerfilHeader';
import { Contatos } from '../../components/Perfil/Contato';
import { Feedbacks } from '../../components/Perfil/Feedback';
import { Sobre } from '../../components/Perfil/Sobre';
import { Habilidades } from '../../components/Perfil/Habilidades';
import { Formacoes } from '../../components/Perfil/Formacoes';
import { Experiencias } from '../../components/Perfil/Experiencias';
import { Cursos } from '../../components/Perfil/Cursos';
import { DocumentosSection } from '../../components/Perfil/DocumentosSection';
import { SubperfilSection } from '../../components/Perfil/SubperfilSection';

import { PerfilModal } from '../../components/Perfil/PerfilModal';

import { usePerfil } from './usePerfil';

import styles from './Perfil.module.css';

export const Perfil: React.FC = () => {
  const {
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
  } = usePerfil();

  if (loading) {
    return <p>Carregando perfil...</p>;
  }

  if (!usuario) {
    return <p>Não foi possível carregar o perfil.</p>;
  }

  const formacaoSelecionada =
    formacaoEditando !== null
      ? perfil.formacoes?.[formacaoEditando]
      : undefined;

  const experienciaSelecionada =
    experienciaEditando !== null
      ? perfil.experiencias?.[experienciaEditando]
      : undefined;

  const cursoSelecionado =
    cursoEditando !== null
      ? perfil.cursos?.[cursoEditando]
      : undefined;

  return (
    <div>
      <Topbar />

      <main className={styles.perfilWrapper}>
        <section className={styles.perfilSection}>
          <PerfilHeader
            usuario={usuario}
            onEditarContatos={() => abrirModal('contatos')}
            onUploadFoto={uploadFoto}
            carregandoFoto={carregandoFoto}
          />

          <Contatos perfil={perfil} />

          <div className={styles.analiseFooter}>
            <p>
              <i className="fas fa-eye" /> {0} visualizações no perfil
            </p>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={resetarPerfil}
            >
              Redefinir tudo
            </button>
          </div>
        </section>

        {/* Informações Específicas da Categoria (Subperfil) */}
        <SubperfilSection
          tipoUsuario={usuario.tipoUsuario}
          perfil={perfil}
          onEditar={() => abrirModal('subperfil')}
        />

        {/* Gestão de Documentos Comprobatórios */}
        <DocumentosSection
          tipoUsuario={usuario.tipoUsuario}
          documentos={perfil.documentos || []}
          onUploadDocumento={uploadDocumento}
        />

        <Feedbacks />

        <Sobre
          perfil={perfil}
          onEditar={() => abrirModal('sobre')}
        />

        <Habilidades
          habilidades={perfil.habilidades || []}
          onAdicionar={() => abrirModal('habilidade')}
          onExcluir={excluirHabilidade}
        />

        {/* Formações e Cursos acadêmicos/pessoais são exibidos para pessoas físicas (Estudantes e MEIs autônomos) */}
        {!['EMPRESA', 'ME'].includes(usuario.tipoUsuario?.toUpperCase() || '') && (
          <Formacoes
            formacoes={perfil.formacoes || []}
            onAdicionar={() => {
              setFormacaoEditando(null);
              abrirModal('formacao');
            }}
            onEditar={editarFormacao}
            onExcluir={excluirFormacao}
          />
        )}

        <Experiencias
          experiencias={perfil.experiencias || []}
          onAdicionar={() => {
            setExperienciaEditando(null);
            abrirModal('experiencia');
          }}
          onEditar={editarExperiencia}
          onExcluir={excluirExperiencia}
        />

        {!['EMPRESA', 'ME'].includes(usuario.tipoUsuario?.toUpperCase() || '') && (
          <Cursos
            cursos={perfil.cursos || []}
            onAdicionar={() => {
              setCursoEditando(null);
              abrirModal('curso');
            }}
            onEditar={editarCurso}
            onExcluir={excluirCurso}
          />
        )}
      </main>

      {modalAberto && (
        <PerfilModal
          key={modalAberto}
          tipo={modalAberto}
          tipoUsuario={usuario.tipoUsuario}
          onClose={fecharModal}
          perfil={perfil}
          formacao={formacaoSelecionada}
          experiencia={experienciaSelecionada}
          curso={cursoSelecionado}
          onSalvarContatos={atualizarContatos}
          onSalvarSobre={atualizarSobre}
          onSalvarHabilidade={adicionarHabilidade}
          onSalvarFormacao={adicionarFormacao}
          onSalvarExperiencia={adicionarExperiencia}
          onSalvarCurso={adicionarCurso}
          onSalvarSubperfil={salvarSubperfil}
        />
      )}
    </div>
  );
};