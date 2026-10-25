import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText } from 'lucide-react';

import { Topbar } from '../../components/Topbar/Topbar';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
import { VagaCard } from '../../components/VagaCard/VagaCard';
import { ComentariosDrawer } from '../../components/ComentariosDrawer/ComentariosDrawer';
import { CandidaturaCard } from '../../components/CandidaturaCard/CandidaturaCard';
import { CandidatosDrawer } from '../../components/CandidatosDrawer/CandidatosDrawer';
import { useMinhasVagas } from './useMinhasVagas';
import { obterTraducoes } from '../../utils/i18n';
import type { VagaResponseDTO } from '../../types/vagas';
import styles from './MinhasVagas.module.css';

type AbaMinhasVagas = 'publicacoes' | 'candidaturas';

export const MinhasVagas: React.FC = () => {
  const navigate = useNavigate();
  const t = obterTraducoes();
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

    candidaturas,
    loadingCandidaturas,
  } = useMinhasVagas();

  const isEstudante =
    usuarioLogado?.tipoUsuario?.toLowerCase() === 'estudante' ||
    usuarioLogado?.tipoUsuario?.toLowerCase() === 'aluno';

  const [abaAtiva, setAbaAtiva] = useState<AbaMinhasVagas>(
    isEstudante ? 'candidaturas' : 'publicacoes'
  );

  const [vagaAtivaComentarios, setVagaAtivaComentarios] = useState<VagaResponseDTO | null>(null);
  const [vagaAtivaCandidatos, setVagaAtivaCandidatos] = useState<VagaResponseDTO | null>(null);

  const vagaDrawerAtualizada =
    vagas.find((v) => v.id === vagaAtivaComentarios?.id) || null;

  return (
    <div>
      <Topbar />

      <main className={styles.wrapper}>
        <div id="vagas-container">
          {/* Se for estudante, mostra título direto. Se for empresa/MEI, mostra abas de alternância */}
          {isEstudante ? (
            <h2 className={styles.titulo}>Minhas Candidaturas</h2>
          ) : (
            <div className={styles.abasContainer}>
              <button
                type="button"
                className={`${styles.abaBtn} ${abaAtiva === 'publicacoes' ? styles.abaAtiva : ''}`}
                onClick={() => setAbaAtiva('publicacoes')}
              >
                <Briefcase size={16} />
                Minhas Publicações
                <span className={styles.badgeContador}>{vagas.length}</span>
              </button>

              <button
                type="button"
                className={`${styles.abaBtn} ${abaAtiva === 'candidaturas' ? styles.abaAtiva : ''}`}
                onClick={() => setAbaAtiva('candidaturas')}
              >
                <FileText size={16} />
                Minhas Candidaturas
                <span className={styles.badgeContador}>{candidaturas.length}</span>
              </button>
            </div>
          )}

          {/* Conteúdo da Aba: Minhas Candidaturas */}
          {(isEstudante || abaAtiva === 'candidaturas') && (
            loadingCandidaturas ? (
              <p>{t.carregandoVagas}</p>
            ) : candidaturas.length === 0 ? (
              <div className={styles.estadoVazio}>
                <span className={styles.emptyIcon}>🎓</span>
                <h3 className={styles.emptyTitulo}>{t.areaCandidaturas}</h3>
                <p className={styles.emptySub}>
                  {isEstudante
                    ? t.estudanteDesc
                    : 'Sua empresa ainda não enviou propostas para nenhuma vaga temporária.'}
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/home')}
                >
                  {t.explorarVagasCompativeis}
                </button>
              </div>
            ) : (
              <div>
                {candidaturas.map((cand) => (
                  <CandidaturaCard key={cand.id} candidatura={cand} />
                ))}
              </div>
            )
          )}

          {/* Conteúdo da Aba: Minhas Publicações (Empresa/MEI/Prestador) */}
          {!isEstudante && abaAtiva === 'publicacoes' && (
            loading ? (
              <p>{t.carregandoVagas}</p>
            ) : vagas.length === 0 ? (
              <div className={styles.estadoVazio}>
                <span className={styles.emptyIcon}>💼</span>
                <h3 className={styles.emptyTitulo}>Nenhuma vaga publicada ainda</h3>
                <p className={styles.emptySub}>
                  Publique oportunidades temporárias para encontrar estudantes e profissionais qualificados.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleAbrirCriacao()}
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
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onAbrirComentarios={(v) => setVagaAtivaComentarios(v)}
                  onEditar={handleAbrirCriacao}
                  onExcluir={handleExcluirVaga}
                  onVerCandidatos={(v) => setVagaAtivaCandidatos(v)}
                />
              ))
            )
          )}
        </div>
      </main>

      {/* Botão flutuante para criar vaga (apenas quando na aba de publicações) */}
      {!isEstudante && abaAtiva === 'publicacoes' && (
        <FloatingButton
          onClick={() => handleAbrirCriacao()}
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