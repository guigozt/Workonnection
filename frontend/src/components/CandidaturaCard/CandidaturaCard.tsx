import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Laptop,
  MapPin,
  CircleDollarSign,
  Calendar,
  MessageSquare,
  Clock3,
  CheckCircle,
  Star,
  Activity,
  Award,
  XCircle,
} from 'lucide-react';
import type { CandidaturaResponseDTO, StatusCandidatura } from '../../types/candidatura';
import { ModalFeedback } from '../ModalFeedback/ModalFeedback';
import { feedbackService } from '../../services/feedbackService';
import styles from './CandidaturaCard.module.css';

interface CandidaturaCardProps {
  candidatura: CandidaturaResponseDTO;
}

export const CandidaturaCard: React.FC<CandidaturaCardProps> = ({ candidatura }) => {
  const navigate = useNavigate();
  const [modalFeedbackAberto, setModalFeedbackAberto] = useState(false);
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const statusElegivelFeedback =
    candidatura.status === 'CONCLUIDO' ||
    candidatura.status === 'RECUSADO' ||
    candidatura.status === 'EM_ANDAMENTO' ||
    candidatura.status === 'ALINHAMENTO_FINAL';

  useEffect(() => {
    if (statusElegivelFeedback && candidatura.id) {
      feedbackService
        .buscarStatusFeedback(candidatura.id)
        .then((resp) => {
          if (resp.candidatoEnviou) {
            setFeedbackEnviado(true);
          }
        })
        .catch(() => {});
    }
  }, [candidatura.id, statusElegivelFeedback]);

  const renderStatusBadge = (status: StatusCandidatura) => {
    switch (status) {
      case 'INSCRITO':
        return (
          <span className={`${styles.statusBadge} ${styles.statusInscrito}`}>
            <Clock3 size={14} /> Inscrito
          </span>
        );
      case 'EM_CHAT':
        return (
          <span className={`${styles.statusBadge} ${styles.statusChat}`}>
            <MessageSquare size={14} /> Em Alinhamento
          </span>
        );
      case 'ALINHAMENTO_FINAL':
        return (
          <span className={`${styles.statusBadge} ${styles.statusFinal}`}>
            <Star size={14} /> Etapa Final
          </span>
        );
      case 'EM_ANDAMENTO':
        return (
          <span className={`${styles.statusBadge} ${styles.statusAndamento}`}>
            <Activity size={14} /> Em Andamento
          </span>
        );
      case 'CONCLUIDO':
        return (
          <span className={`${styles.statusBadge} ${styles.statusConcluido}`}>
            <Award size={14} /> Concluído
          </span>
        );
      case 'RECUSADO':
        return (
          <span className={`${styles.statusBadge} ${styles.statusRecusado}`}>
            <XCircle size={14} /> Não Selecionado
          </span>
        );
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.statusInscrito}`}>
            <CheckCircle size={14} /> {status}
          </span>
        );
    }
  };

  const dataFormatada = candidatura.criadaEm
    ? new Date(candidatura.criadaEm).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cargoInfo}>
          <h3>{candidatura.vagaCargo || 'Vaga Temporária'}</h3>
          <span className={styles.empresa}>{candidatura.vagaEmpresa || 'Empresa Contratante'}</span>
        </div>
        {renderStatusBadge(candidatura.status)}
      </div>

      <div className={styles.detalhesVaga}>
        {candidatura.vagaModalidade && (
          <span className={styles.tag}>
            <Laptop size={14} />
            {candidatura.vagaModalidade}
          </span>
        )}
        {candidatura.vagaLocalizacao && (
          <span className={styles.tag}>
            <MapPin size={14} />
            {candidatura.vagaLocalizacao}
          </span>
        )}
        {candidatura.vagaSalario && (
          <span className={styles.tag}>
            <CircleDollarSign size={14} />
            {candidatura.vagaSalario}
          </span>
        )}
      </div>

      {candidatura.mensagemApresentacao && (
        <div className={styles.apresentacaoBox}>
          <span className={styles.apresentacaoLabel}>Sua Proposta / Apresentação enviada:</span>
          <p className={styles.apresentacaoTexto}>"{candidatura.mensagemApresentacao}"</p>
        </div>
      )}

      <div className={styles.footer}>
        <span>
          <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Candidatou-se em {dataFormatada}
        </span>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {candidatura.status === 'EM_CHAT' && (
            <button
              type="button"
              className={styles.btnChat}
              onClick={() => navigate(`/mensagens?contatoId=${candidatura.contratanteId}`)}
              title="Ir para o Chat com o Contratante"
            >
              <MessageSquare size={14} /> Abrir Chat
            </button>
          )}

          {/* Botão de Feedback após decisão de aceitação ou recusa */}
          {statusElegivelFeedback && (
            feedbackEnviado ? (
              <span className={styles.btnFeedbackEnviado} title="Você já enviou seu feedback">
                <CheckCircle size={14} /> Feedback Enviado
              </span>
            ) : (
              <button
                type="button"
                className={styles.btnFeedback}
                onClick={() => setModalFeedbackAberto(true)}
                title="Avaliar processo seletivo e a empresa"
              >
                <Star size={14} /> Avaliar Empresa & Processo
              </button>
            )
          )}
        </div>
      </div>

      {modalFeedbackAberto && (
        <ModalFeedback
          isOpen={modalFeedbackAberto}
          candidaturaId={candidatura.id}
          tituloVaga={candidatura.vagaCargo || 'Vaga Temporária'}
          isContratante={false}
          decisao={candidatura.status === 'RECUSADO' ? 'RECUSADO' : 'ACEITO'}
          onClose={() => setModalFeedbackAberto(false)}
          onSuccess={() => setFeedbackEnviado(true)}
        />
      )}
    </div>
  );
};
