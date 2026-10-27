import React, { useEffect, useState } from 'react';
import { Star, MessageSquareQuote, CheckCircle, XCircle, Briefcase, Sparkles } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import type { FeedbackResponseDTO } from '../../types/feedback';
import styles from './FeedbacksSection.module.css';

const FOTO_DEFAULT =
  'https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png';

interface FeedbacksSectionProps {
  usuarioId: string;
}

export const FeedbacksSection: React.FC<FeedbacksSectionProps> = ({ usuarioId }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) return;

    let ativo = true;
    feedbackService
      .listarFeedbacksDoPerfil(usuarioId, 10)
      .then((dados) => {
        if (!ativo) return;
        setFeedbacks(dados);
      })
      .catch((err) => {
        console.error('Erro ao buscar feedbacks do perfil:', err);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.titulo}>
          <MessageSquareQuote size={20} color="#0284c7" />
          Avaliações e Feedbacks Recentes
          <span className={styles.badgeContador}>{feedbacks.length}</span>
        </h3>
      </div>

      {loading ? (
        <p className={styles.vazio}>Carregando avaliações...</p>
      ) : feedbacks.length === 0 ? (
        <div className={styles.vazio}>
          <Sparkles size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>Nenhuma avaliação recebida ainda. Os feedbacks de processos seletivos aparecerão aqui.</p>
        </div>
      ) : (
        <div className={styles.listaFeedbacks}>
          {feedbacks.map((f) => {
            const dataFormatada = f.criadoEm
              ? new Date(f.criadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '';

            return (
              <div key={f.id} className={styles.cardFeedback}>
                <div className={styles.topRow}>
                  <div className={styles.autorInfo}>
                    <img
                      src={f.autorFotoUrl || FOTO_DEFAULT}
                      alt={f.autorNome || 'Autor'}
                      className={styles.avatar}
                    />
                    <div className={styles.autorNomeETipo}>
                      <h4>{f.autorNome || 'Avaliação de Processo'}</h4>
                      <span className={styles.vagaBadge}>
                        <Briefcase size={12} />
                        {f.tituloVaga || 'Vaga Temporária'} •{' '}
                        {f.tipoAutor === 'CONTRATANTE' ? 'Contratante' : 'Candidato'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.ratingCol}>
                    {f.notaGeral && (
                      <div className={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={star <= (f.notaGeral || 0) ? '#f59e0b' : 'none'}
                            color={star <= (f.notaGeral || 0) ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    )}
                    <span className={styles.dataEnvio}>{dataFormatada}</span>
                  </div>
                </div>

                <div className={styles.conteudoFeedback}>
                  <div>
                    {f.decisao === 'ACEITO' ? (
                      <span className={styles.decisaoTagAceito}>
                        <CheckCircle size={12} /> Selecionado / Aprovado
                      </span>
                    ) : (
                      <span className={styles.decisaoTagRecusado}>
                        <XCircle size={12} /> Não Selecionado
                      </span>
                    )}
                  </div>

                  {/* Feedback vindo do Contratante */}
                  {f.tipoAutor === 'CONTRATANTE' && (
                    <>
                      {f.motivoPrincipal && (
                        <p className={styles.textoPrincipal}>
                          <strong>Motivos da decisão:</strong> {f.motivoPrincipal}
                        </p>
                      )}

                      {f.pontosFortes && f.pontosFortes.length > 0 && (
                        <div className={styles.blocoTags}>
                          <span className={styles.blocoTagsLabel}>Pontos fortes:</span>
                          {f.pontosFortes.map((pf, idx) => (
                            <span key={idx} className={styles.chipForte}>
                              {pf}
                            </span>
                          ))}
                        </div>
                      )}

                      {f.competenciasMelhoria && f.competenciasMelhoria.length > 0 && (
                        <div className={styles.blocoTags}>
                          <span className={styles.blocoTagsLabel}>Oportunidades de melhoria:</span>
                          {f.competenciasMelhoria.map((cm, idx) => (
                            <span key={idx} className={styles.chipMelhoria}>
                              {cm}
                            </span>
                          ))}
                        </div>
                      )}

                      {f.dicaConstrutiva && (
                        <p className={styles.dicaBox}>
                          💡 <em>"{f.dicaConstrutiva}"</em>
                        </p>
                      )}
                    </>
                  )}

                  {/* Feedback vindo do Candidato / Contratado */}
                  {f.tipoAutor === 'CANDIDATO' && (
                    <>
                      {f.avaliacaoProcesso && (
                        <p className={styles.textoPrincipal}>
                          <strong>Sobre o processo:</strong> {f.avaliacaoProcesso}
                        </p>
                      )}

                      {f.avaliacaoEmpresa && (
                        <p className={styles.textoPrincipal}>
                          <strong>Sobre a empresa:</strong> {f.avaliacaoEmpresa}
                        </p>
                      )}

                      {(f.clarezaRequisitos || f.comunicacaoContratante) && (
                        <div className={styles.blocoTags}>
                          {f.clarezaRequisitos && (
                            <span className={styles.chipForte}>
                              Clareza dos requisitos: {f.clarezaRequisitos}/5 ⭐
                            </span>
                          )}
                          {f.comunicacaoContratante && (
                            <span className={styles.chipForte}>
                              Comunicação da empresa: {f.comunicacaoContratante}/5 ⭐
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
