import React, { useState } from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
import { VagaCard } from '../../components/VagaCard/VagaCard';
import { ComentariosDrawer } from '../../components/ComentariosDrawer/ComentariosDrawer';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
import { FiltroVagas } from '../../components/FiltroVagas/FiltroVagas';
import { useHome } from './useHome';
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

  const [vagaAtivaComentarios, setVagaAtivaComentarios] = useState<VagaResponseDTO | null>(null);

  const vagaDrawerAtualizada = vagas.find((v) => v.id === vagaAtivaComentarios?.id) || null;

  return (
    <div>
      <Topbar notificacoesNaoLidas={3} />

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
        />

        <div id="vagas-container">
          {loading ? (
            <div className={styles.estadoVazio}>
              <div className={styles.spinner} />
              <p>Carregando vagas...</p>
            </div>
          ) : vagas.length === 0 ? (
            <div className={styles.estadoVazio}>
              {temFiltrosAtivos ? (
                <>
                  <p className={styles.msgVaziaTitulo}>Nenhuma vaga encontrada com os critérios informados.</p>
                  <p className={styles.msgVaziaSub}>Tente alterar os termos de busca ou remover alguns filtros.</p>
                  <button type="button" className={styles.btnResetVazio} onClick={handleLimparFiltros}>
                    Limpar Filtros
                  </button>
                </>
              ) : (
                <p>Nenhuma vaga cadastrada no momento.</p>
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

      <FloatingButton onClick={handleAbrirCriacao} title="Criar Nova Vaga" />

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