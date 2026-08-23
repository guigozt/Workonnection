import React, { useState } from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
import { VagaCard } from '../../components/VagaCard/VagaCard';
import { ComentariosDrawer } from '../../components/ComentariosDrawer/ComentariosDrawer';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
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
    handleAbrirCriacao,
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
        <div id="vagas-container">

          {loading ? (
            <p>Carregando vagas...</p>
          ) : vagas.length === 0 ? (
            <p>Nenhuma vaga cadastrada no momento.</p>
          ) : (
            vagas.map((vaga) => (
              <VagaCard
                key={vaga.id}
                vaga={vaga}
                usuarioLogado={usuarioLogado}
                onLike={handleLike}
                onDislike={handleDislike}
                onAbrirComentarios={(v) => setVagaAtivaComentarios(v)}
                onEditar={handleAbrirCriacao}
                onExcluir={handleExcluirVaga}
              />
            ))
          )}
        </div>
      </main>

      <FloatingButton onClick={handleAbrirCriacao} title="Criar Nova Vaga" />

      <ModalVaga
        isOpen={isModalOpen}
        onClose={handleFecharModal}
        onSuccess={handleSalvarVagaSucesso}
        vagaParaEditar={vagaEmEdicao}
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