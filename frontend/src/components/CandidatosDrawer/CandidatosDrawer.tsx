import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Users,
  MessageSquare,
  Star,
  CheckCircle,
  Clock3,
} from 'lucide-react';
import { candidaturaService } from '../../services/candidaturaService';
import type { VagaResponseDTO } from '../../types/vagas';
import type { CandidaturaResponseDTO, StatusCandidatura } from '../../types/candidatura';
import styles from './CandidatosDrawer.module.css';

const FOTO_DEFAULT =
  'https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png';

interface CandidatosDrawerProps {
  isOpen: boolean;
  vaga: VagaResponseDTO | null;
  onClose: () => void;
  onCandidaturaAtualizada?: (candidatura: CandidaturaResponseDTO) => void;
}

export const CandidatosDrawer: React.FC<CandidatosDrawerProps> = ({
  isOpen,
  vaga,
  onClose,
  onCandidaturaAtualizada,
}) => {
  const navigate = useNavigate();
  const [candidaturas, setCandidaturas] = useState<CandidaturaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    if (isOpen && vaga?.id) {
      setLoading(true);
      candidaturaService
        .gerenciarRecebidas(vaga.id)
        .then((dados) => {
          if (ativo) {
            setCandidaturas(dados);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar candidatos da vaga:', err);
          if (ativo) setLoading(false);
        });
    } else {
      setCandidaturas([]);
    }

    return () => {
      ativo = false;
    };
  }, [isOpen, vaga?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!vaga) return null;

  const handleChamarNoChat = async (cand: CandidaturaResponseDTO) => {
    try {
      setAtualizandoId(cand.id);
      if (cand.status === 'INSCRITO') {
        const atualizada = await candidaturaService.atualizarStatus(cand.id, 'EM_CHAT');
        setCandidaturas((prev) =>
          prev.map((c) => (c.id === cand.id ? atualizada : c))
        );
        onCandidaturaAtualizada?.(atualizada);
      }
      onClose();
      navigate('/mensagens');
    } catch (err) {
      console.error('Erro ao atualizar status para EM_CHAT:', err);
      alert('Erro ao iniciar chat com o candidato.');
    } finally {
      setAtualizandoId(null);
    }
  };

  const handleAvancarEtapaFinal = async (cand: CandidaturaResponseDTO) => {
    try {
      setAtualizandoId(cand.id);
      const atualizada = await candidaturaService.atualizarStatus(cand.id, 'ALINHAMENTO_FINAL');
      setCandidaturas((prev) =>
        prev.map((c) => (c.id === cand.id ? atualizada : c))
      );
      onCandidaturaAtualizada?.(atualizada);
      alert(`O candidato ${cand.candidatoNome || ''} foi avançado para a Etapa Final com sucesso!`);
    } catch (err) {
      console.error('Erro ao avançar status para ALINHAMENTO_FINAL:', err);
      alert('Erro ao atualizar status da candidatura.');
    } finally {
      setAtualizandoId(null);
    }
  };

  const renderStatusTag = (status: StatusCandidatura) => {
    switch (status) {
      case 'INSCRITO':
        return (
          <span className={`${styles.statusTag} ${styles.statusInscrito}`}>
            <Clock3 size={13} /> Inscrito
          </span>
        );
      case 'EM_CHAT':
        return (
          <span className={`${styles.statusTag} ${styles.statusChat}`}>
            <MessageSquare size={13} /> Em Alinhamento
          </span>
        );
      case 'ALINHAMENTO_FINAL':
        return (
          <span className={`${styles.statusTag} ${styles.statusFinal}`}>
            <Star size={13} /> Etapa Final
          </span>
        );
      default:
        return (
          <span className={`${styles.statusTag} ${styles.statusInscrito}`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.aberto : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h3>Candidatos Inscritos</h3>
            <span className={styles.subtitulo}>
              {vaga.cargo}
              <span className={styles.badgeContador}>{candidaturas.length}</span>
            </span>
          </div>
          <button
            type="button"
            className={styles.btnFechar}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className={styles.conteudo}>
          {loading ? (
            <div className={styles.loadingOuVazio}>
              <p>Carregando candidatos...</p>
            </div>
          ) : candidaturas.length === 0 ? (
            <div className={styles.loadingOuVazio}>
              <Users size={48} style={{ opacity: 0.3 }} />
              <p>Nenhum candidato se inscreveu nesta vaga ainda.</p>
            </div>
          ) : (
            candidaturas.map((cand) => (
              <div key={cand.id} className={styles.cardCandidato}>
                <div className={styles.candidatoHeader}>
                  <div className={styles.candidatoPerfil}>
                    <img
                      src={cand.candidatoFotoUrl || FOTO_DEFAULT}
                      alt={cand.candidatoNome || 'Candidato'}
                      className={styles.avatar}
                    />
                    <div className={styles.nomeETipo}>
                      <h4>{cand.candidatoNome || 'Candidato sem nome'}</h4>
                      <span className={styles.tipoBadge}>
                        {cand.tipoCandidato || 'Prestador'}
                      </span>
                    </div>
                  </div>
                  <span className={styles.dataEnvio}>
                    {cand.criadaEm
                      ? new Date(cand.criadaEm).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : ''}
                  </span>
                </div>

                {cand.candidatoSobre && (
                  <p className={styles.sobreCandidato}>{cand.candidatoSobre}</p>
                )}

                {cand.candidatoHabilidades && cand.candidatoHabilidades.length > 0 && (
                  <div className={styles.habilidades}>
                    {cand.candidatoHabilidades.map((hab, idx) => (
                      <span key={idx} className={styles.chipHabilidade}>
                        {hab}
                      </span>
                    ))}
                  </div>
                )}

                {cand.mensagemApresentacao && (
                  <div className={styles.propostaBox}>
                    <span className={styles.propostaLabel}>Apresentação / Proposta do Candidato:</span>
                    <p className={styles.propostaTexto}>"{cand.mensagemApresentacao}"</p>
                  </div>
                )}

                <div className={styles.statusLinha}>
                  {renderStatusTag(cand.status)}

                  <div className={styles.acoesContratante}>
                    <button
                      type="button"
                      className={styles.btnAcaoChat}
                      disabled={atualizandoId === cand.id}
                      onClick={() => handleChamarNoChat(cand)}
                      title="Abrir alinhamento no chat"
                    >
                      <MessageSquare size={13} />
                      {cand.status === 'INSCRITO' ? 'Chamar no Chat' : 'Abrir Chat'}
                    </button>

                    {cand.status !== 'ALINHAMENTO_FINAL' && (
                      <button
                        type="button"
                        className={styles.btnAcaoFinal}
                        disabled={atualizandoId === cand.id}
                        onClick={() => handleAvancarEtapaFinal(cand)}
                        title="Avançar para Etapa Final"
                      >
                        <Star size={13} /> Etapa Final
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
