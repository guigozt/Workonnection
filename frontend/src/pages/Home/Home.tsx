import React, { useState } from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
import { ModalCandidatura } from '../../components/ModalCandidatura/ModalCandidatura';
import { CandidatosDrawer } from '../../components/CandidatosDrawer/CandidatosDrawer';
import { VagaCard } from '../../components/VagaCard/VagaCard';
import { ComentariosDrawer } from '../../components/ComentariosDrawer/ComentariosDrawer';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
import { FiltroVagas } from '../../components/FiltroVagas/FiltroVagas';
import { useHome } from './useHome';
import { obterTraducoes } from '../../utils/i18n';
import type { VagaResponseDTO } from '../../types/vagas';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const {
    vagas,
    loading,
    usuarioLogado,
    isModalOpen,
    vagaEmEdicao,
    busca,
    setBusca,
    modalidade,
    setModalidade,
    tipo,
    setTipo,
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
    vagasInscritasIds,
    handleCandidaturaSucesso,
  } = useHome();

  const t = obterTraducoes();

  const [vagaAtivaComentarios, setVagaAtivaComentarios] = useState<VagaResponseDTO | null>(null);
  const [vagaParaCandidatar, setVagaParaCandidatar] = useState<VagaResponseDTO | null>(null);
  const [vagaAtivaCandidatos, setVagaAtivaCandidatos] = useState<VagaResponseDTO | null>(null);

  const vagaDrawerAtualizada = vagas.find((v) => v.id === vagaAtivaComentarios?.id) || null;

  const isEstudante =
    usuarioLogado?.tipoUsuario?.toLowerCase() === 'estudante' ||
    usuarioLogado?.tipoUsuario?.toLowerCase() === 'aluno';

  return (
    <div>
      <Topbar />

      <main className={styles.homeWrapper}>
        <FiltroVagas
          busca={busca}
          onBuscaChange={setBusca}
          modalidade={modalidade}
          onModalidadeChange={setModalidade}
          tipo={tipo}
          onTipoChange={setTipo}
          onLimparFiltros={handleLimparFiltros}
          temFiltrosAtivos={temFiltrosAtivos}
          totalVagas={vagas.length}
          tipoUsuarioLogado={usuarioLogado?.tipoUsuario}
        />

        <div id="vagas-container">
          {loading ? (
            <div className={styles.estadoVazio}>
              <div className={styles.spinner} />
              <p>{t.carregandoVagas}</p>
            </div>
          ) : vagas.length === 0 ? (
            <div className={styles.estadoVazio}>
              {temFiltrosAtivos ? (
                <>
                  <p className={styles.msgVaziaTitulo}>{t.nenhumaVagaEncontrada}</p>
                  <p className={styles.msgVaziaSub}>{t.nenhumaVagaSub}</p>
                  <button type="button" className={styles.btnResetVazio} onClick={handleLimparFiltros}>
                    {t.limparFiltros}
                  </button>
                </>
              ) : (
                <p>{t.nenhumaVagaCadastrada}</p>
              )}
            </div>
          ) : (
            vagas.map((vaga) => (
              <VagaCard
                key={vaga.id}
                vaga={vaga}
                usuarioLogado={usuarioLogado}
                estaInscrito={vagasInscritasIds.has(vaga.id)}
                onLike={handleLike}
                onDislike={handleDislike}
                onAbrirComentarios={(v) => setVagaAtivaComentarios(v)}
                onEditar={handleAbrirEdicao}
                onExcluir={handleExcluirVaga}
                onCandidatar={(v) => setVagaParaCandidatar(v)}
                onVerCandidatos={(v) => setVagaAtivaCandidatos(v)}
              />
            ))
          )}
        </div>
      </main>

      {!isEstudante && (
        <FloatingButton onClick={handleAbrirCriacao} title={t.criarNovaVaga} />
      )}

      {isModalOpen && (
        <ModalVaga
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          onSuccess={handleSalvarVagaSucesso}
          vagaParaEditar={vagaEmEdicao}
        />
      )}

      <ModalCandidatura
        isOpen={Boolean(vagaParaCandidatar)}
        vaga={vagaParaCandidatar}
        onClose={() => setVagaParaCandidatar(null)}
        onSuccess={handleCandidaturaSucesso}
      />

      <CandidatosDrawer
        isOpen={Boolean(vagaAtivaCandidatos)}
        vaga={vagaAtivaCandidatos}
        onClose={() => setVagaAtivaCandidatos(null)}
      />

      <ComentariosDrawer
        isOpen={Boolean(vagaAtivaComentarios)}
        vaga={vagaDrawerAtualizada}
        usuarioLogado={usuarioLogado}
        onClose={() => setVagaAtivaComentarios(null)}
        onEnviarComentario={handleEnviarComentario}
        onExcluirComentario={handleExcluirComentario}
      />
    </div>
  );
};