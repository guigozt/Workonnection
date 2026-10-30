import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import type { FeedbackResponseDTO } from '../../types/feedback';
import styles from './AvaliacaoResumo.module.css';

interface AvaliacaoResumoProps {
  usuarioId: string;
}

export const AvaliacaoResumo: React.FC<AvaliacaoResumoProps> = ({ usuarioId }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) return;

    let ativo = true;
    feedbackService
      .listarFeedbacksDoPerfil(usuarioId, 50)
      .then((dados) => {
        if (!ativo) return;
        setFeedbacks(dados);
      })
      .catch((err) => {
        console.error('Erro ao buscar avaliações do usuário:', err);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Star size={16} className={styles.starPlaceholder} />
          <span>Carregando avaliação...</span>
        </div>
      </div>
    );
  }

  const notasValidas = feedbacks
    .map((f) => f.notaGeral)
    .filter((n): n is number => typeof n === 'number' && n > 0);

  const totalAvaliacoes = notasValidas.length;
  const media =
    totalAvaliacoes > 0
      ? (notasValidas.reduce((acc, curr) => acc + curr, 0) / totalAvaliacoes).toFixed(1)
      : null;

  const mediaNumero = media ? parseFloat(media) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.starsWrapper}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = mediaNumero >= star;
          const half = !filled && mediaNumero >= star - 0.5;

          return (
            <span key={star} className={styles.starIcon}>
              <Star
                size={18}
                fill={filled ? '#f59e0b' : half ? '#fde68a' : 'none'}
                color={filled || half ? '#f59e0b' : 'var(--text-light, #94a3b8)'}
              />
            </span>
          );
        })}
      </div>

      <div className={styles.textos}>
        {totalAvaliacoes > 0 ? (
          <>
            <span className={styles.mediaValor}>{media}</span>
            <span className={styles.contador}>
              ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </>
        ) : (
          <span className={styles.semAvaliacao}>Sem avaliações ainda</span>
        )}
      </div>
    </div>
  );
};
