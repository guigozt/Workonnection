import React, { useState, useEffect } from 'react';
import { X, Star, Send, Plus } from 'lucide-react';
import { isAxiosError } from 'axios';
import { feedbackService } from '../../services/feedbackService';
import type { FeedbackResponseDTO, FeedbackCreateDTO } from '../../types/feedback';
import styles from './ModalFeedback.module.css';

export interface ModalFeedbackProps {
  isOpen: boolean;
  candidaturaId: string;
  tituloVaga: string;
  isContratante: boolean;
  decisao: 'ACEITO' | 'RECUSADO';
  onClose: () => void;
  onSuccess: (feedback: FeedbackResponseDTO) => void;
}

export const ModalFeedback: React.FC<ModalFeedbackProps> = ({
  isOpen,
  candidaturaId,
  tituloVaga,
  isContratante,
  decisao,
  onClose,
  onSuccess,
}) => {
  const [notaGeral, setNotaGeral] = useState<number>(5);

  // Campos Contratante
  const [motivoPrincipal, setMotivoPrincipal] = useState('');
  const [dicaConstrutiva, setDicaConstrutiva] = useState('');
  const [novoPontoForte, setNovoPontoForte] = useState('');
  const [pontosFortes, setPontosFortes] = useState<string[]>([]);
  const [novaMelhoria, setNovaMelhoria] = useState('');
  const [competenciasMelhoria, setCompetenciasMelhoria] = useState<string[]>([]);

  // Campos Candidato
  const [avaliacaoProcesso, setAvaliacaoProcesso] = useState('');
  const [avaliacaoEmpresa, setAvaliacaoEmpresa] = useState('');
  const [clarezaRequisitos, setClarezaRequisitos] = useState<number>(5);
  const [comunicacaoContratante, setComunicacaoContratante] = useState<number>(5);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddPontoForte = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoPontoForte.trim() && !pontosFortes.includes(novoPontoForte.trim())) {
      setPontosFortes([...pontosFortes, novoPontoForte.trim()]);
      setNovoPontoForte('');
    }
  };

  const handleRemoverPontoForte = (item: string) => {
    setPontosFortes(pontosFortes.filter((p) => p !== item));
  };

  const handleAddMelhoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaMelhoria.trim() && !competenciasMelhoria.includes(novaMelhoria.trim())) {
      setCompetenciasMelhoria([...competenciasMelhoria, novaMelhoria.trim()]);
      setNovaMelhoria('');
    }
  };

  const handleRemoverMelhoria = (item: string) => {
    setCompetenciasMelhoria(competenciasMelhoria.filter((c) => c !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    const payload: FeedbackCreateDTO = {
      notaGeral,
    };

    if (isContratante) {
      if (!motivoPrincipal.trim()) {
        setErro('Por favor, descreva os motivos que levaram à decisão.');
        setEnviando(false);
        return;
      }
      payload.motivoPrincipal = motivoPrincipal.trim();
      payload.dicaConstrutiva = dicaConstrutiva.trim() || undefined;
      payload.pontosFortes = pontosFortes;
      payload.competenciasMelhoria = competenciasMelhoria;
    } else {
      if (!avaliacaoProcesso.trim() && !avaliacaoEmpresa.trim()) {
        setErro('Por favor, compartilhe sua opinião sobre o processo ou a empresa.');
        setEnviando(false);
        return;
      }
      payload.avaliacaoProcesso = avaliacaoProcesso.trim() || undefined;
      payload.avaliacaoEmpresa = avaliacaoEmpresa.trim() || undefined;
      payload.clarezaRequisitos = clarezaRequisitos;
      payload.comunicacaoContratante = comunicacaoContratante;
    }

    try {
      const resp = await feedbackService.enviarFeedback(candidaturaId, payload);
      alert('🎉 Feedback registrado com sucesso! Obrigado por contribuir com a comunidade.');
      onSuccess(resp);
      onClose();
    } catch (err: unknown) {
      let msg = 'Erro ao enviar feedback. Tente novamente.';
      if (isAxiosError(err) && err.response?.data?.erro) {
        msg = err.response.data.erro;
      }
      setErro(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <span className={isContratante ? styles.badgeContratante : styles.badgeCandidato}>
              {isContratante ? 'Avaliação do Contratante' : 'Avaliação do Candidato'}
            </span>
            <h3>Feedback da Vaga</h3>
            <span className={styles.subInfo}>{tituloVaga} • Decisão: {decisao === 'ACEITO' ? 'Aprovado/Contratado' : 'Não selecionado'}</span>
          </div>
          <button type="button" className={styles.btnClose} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {erro && <div className={styles.alertErro}>{erro}</div>}

          {/* Avaliação Geral em Estrelas */}
          <div className={styles.ratingSection}>
            <span className={styles.label}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              Sua Avaliação Geral (1 a 5 estrelas)
            </span>
            <div className={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles.starBtn}
                  onClick={() => setNotaGeral(star)}
                >
                  <Star
                    size={28}
                    fill={star <= notaGeral ? '#f59e0b' : 'none'}
                    color={star <= notaGeral ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Formulário do Contratante */}
          {isContratante ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Motivos que levaram à decisão ({decisao === 'ACEITO' ? 'Aceitação' : 'Recusa'}) *
                </label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Explique os fatores determinantes na sua escolha..."
                  value={motivoPrincipal}
                  onChange={(e) => setMotivoPrincipal(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pontos Fortes Observados</label>
                <div className={styles.addChipRow}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Ex: Proatividade, boa oratória..."
                    value={novoPontoForte}
                    onChange={(e) => setNovoPontoForte(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPontoForte(e);
                      }
                    }}
                  />
                  <button type="button" className={styles.btnAddChip} onClick={handleAddPontoForte}>
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
                {pontosFortes.length > 0 && (
                  <div className={styles.chipsContainer}>
                    {pontosFortes.map((p, idx) => (
                      <span key={idx} className={styles.chipItem}>
                        {p}
                        <button
                          type="button"
                          className={styles.chipRemoveBtn}
                          onClick={() => handleRemoverPontoForte(p)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Competências ou Áreas para Evoluir</label>
                <div className={styles.addChipRow}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Ex: TypeScript avançado, portfólio..."
                    value={novaMelhoria}
                    onChange={(e) => setNovaMelhoria(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMelhoria(e);
                      }
                    }}
                  />
                  <button type="button" className={styles.btnAddChip} onClick={handleAddMelhoria}>
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
                {competenciasMelhoria.length > 0 && (
                  <div className={styles.chipsContainer}>
                    {competenciasMelhoria.map((c, idx) => (
                      <span key={idx} className={styles.chipItem}>
                        {c}
                        <button
                          type="button"
                          className={styles.chipRemoveBtn}
                          onClick={() => handleRemoverMelhoria(c)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Dica Construtiva ou Mensagem Final</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  placeholder="Deixe uma palavra de incentivo ou recomendação técnica..."
                  value={dicaConstrutiva}
                  onChange={(e) => setDicaConstrutiva(e.target.value)}
                />
              </div>
            </>
          ) : (
            /* Formulário do Candidato / Contratado */
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Como foi o processo seletivo / comunicação?</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Descreva como foi o contato, etapas, agilidade e clareza da oportunidade..."
                  value={avaliacaoProcesso}
                  onChange={(e) => setAvaliacaoProcesso(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Sua opinião sobre a empresa / contratante</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Compartilhe como foi a postura, ambiente e suporte da contratante..."
                  value={avaliacaoEmpresa}
                  onChange={(e) => setAvaliacaoEmpresa(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Clareza dos Requisitos da Vaga</label>
                <span className={styles.helperText}>A vaga condizia exatamente com o que foi pedido?</span>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={styles.starBtn}
                      onClick={() => setClarezaRequisitos(star)}
                    >
                      <Star
                        size={22}
                        fill={star <= clarezaRequisitos ? '#0ea5e9' : 'none'}
                        color={star <= clarezaRequisitos ? '#0ea5e9' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Comunicação e Atenção da Empresa</label>
                <span className={styles.helperText}>Respostas no chat e atenção às suas dúvidas</span>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={styles.starBtn}
                      onClick={() => setComunicacaoContratante(star)}
                    >
                      <Star
                        size={22}
                        fill={star <= comunicacaoContratante ? '#0ea5e9' : 'none'}
                        color={star <= comunicacaoContratante ? '#0ea5e9' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancelar} onClick={onClose} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnEnviar} disabled={enviando}>
              <Send size={16} />
              {enviando ? 'Enviando...' : 'Enviar Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
