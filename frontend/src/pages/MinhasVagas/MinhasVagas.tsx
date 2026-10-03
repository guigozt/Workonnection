import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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

  const isEstudante =
    usuarioLogado?.tipoUsuario?.toLowerCase() === 'estudante' ||
    usuarioLogado?.tipoUsuario?.toLowerCase() === 'aluno';

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
            {isEstudante ? 'Painel do Estudante' : 'Minhas Publicações'}
          </h2>

          {loading ? (
            <p>
              Carregando...
            </p>
          ) : isEstudante ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
              <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>
                Área de Candidaturas
              </h3>
              <p
                style={{
                  marginBottom: '24px',
                  color: '#64748b',
                  maxWidth: '520px',
                  margin: '0 auto 24px auto',
                  lineHeight: '1.6',
                }}
              >
                Como estudante, seu perfil é focado na descoberta de vagas temporárias e candidaturas. Em breve, todo o seu histórico de candidaturas e feedbacks estará centralizado aqui!
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate('/home')}
              >
                Explorar Vagas Compatíveis
              </button>
            </div>
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

      {!isEstudante && (
        <FloatingButton
          onClick={() =>
            handleAbrirCriacao()
          }
          title="Criar Nova Vaga"
        />
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