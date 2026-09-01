import React, { useState } from 'react';

import { Topbar } from '../../components/Topbar/Topbar';

import {
  FloatingButton,
} from '../../components/FloatingButton/FloatingButton';

import {
  ModalVaga,
} from '../../components/ModalVaga/ModalVaga';

import {
  VagaCard,
} from '../../components/VagaCard/VagaCard';

import {
  ComentariosDrawer,
} from '../../components/ComentariosDrawer/ComentariosDrawer';

import {
  useMinhasVagas,
} from './useMinhasVagas';

import type {
  VagaResponseDTO,
} from '../../types/vagas';

import styles from '../Home/Home.module.css';
// Reutilizando o CSS da Home

export const MinhasVagas: React.FC = () => {
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
  } = useMinhasVagas();

  const [
    vagaAtivaComentarios,
    setVagaAtivaComentarios,
  ] = useState<VagaResponseDTO | null>(
    null
  );

  return (
    <div>
      <Topbar notificacoesNaoLidas={3} />

      <main className={styles.homeWrapper}>
        <div id="vagas-container">

          <h2
            style={{
              marginBottom: '24px',
              fontWeight: 'bold',
            }}
          >
            Minhas Publicações
          </h2>

          {loading ? (
            <p>
              Carregando suas vagas...
            </p>
          ) : vagas.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                background: '#fff',
                borderRadius: '8px',
              }}
            >
              <p
                style={{
                  marginBottom: '16px',
                }}
              >
                Você ainda não publicou
                nenhuma vaga.
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  handleAbrirCriacao()
                }
              >
                Criar minha primeira vaga
              </button>
            </div>
          ) : (
            vagas.map((vaga) => (
              <VagaCard
                key={vaga.id}
                vaga={vaga}
                usuarioLogado={usuarioLogado}
                compacto={true}
                // O card vira prévia aqui!

                onLike={handleLike}
                onDislike={handleDislike}

                onAbrirComentarios={(v) =>
                  setVagaAtivaComentarios(v)
                }

                onEditar={handleAbrirCriacao}

                onExcluir={handleExcluirVaga}
              />
            ))
          )}

        </div>
      </main>

      <FloatingButton
        onClick={() =>
          handleAbrirCriacao()
        }
        title="Criar Nova Vaga"
      />

      <ModalVaga
        isOpen={isModalOpen}
        onClose={handleFecharModal}
        onSuccess={handleSalvarVagaSucesso}
        vagaParaEditar={vagaEmEdicao}
      />

      <ComentariosDrawer
        isOpen={Boolean(
          vagaAtivaComentarios
        )}
        vaga={vagaAtivaComentarios}
        usuarioLogado={usuarioLogado}
        onClose={() =>
          setVagaAtivaComentarios(null)
        }
        onEnviarComentario={
          handleEnviarComentario
        }
        onExcluirComentario={
          handleExcluirComentario
        }
      />
    </div>
  );
};