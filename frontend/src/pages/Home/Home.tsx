import React, { useState } from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
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
  } = useHome();

  const t = obterTraducoes();

  const [vagaAtivaComentarios, setVagaAtivaComentarios] = useState<VagaResponseDTO | null>(null);

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
                onLike={handleLike}
                onDislike={handleDislike}
                onAbrirComentarios={(v) => setVagaAtivaComentarios(v)}
                onEditar={handleAbrirEdicao}
                onExcluir={handleExcluirVaga}
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