import React, { useState, useEffect } from 'react';
import { X, Send, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { isAxiosError } from 'axios';
import { candidaturaService } from '../../services/candidaturaService';
import type { VagaResponseDTO } from '../../types/vagas';
import type { CandidaturaResponseDTO } from '../../types/candidatura';
import styles from './ModalCandidatura.module.css';

export interface ModalCandidaturaProps {
  isOpen: boolean;
  vaga: VagaResponseDTO | null;
  onClose: () => void;
  onSuccess: (candidatura: CandidaturaResponseDTO) => void;
}

export const ModalCandidatura: React.FC<ModalCandidaturaProps> = ({
  isOpen,
  vaga,
  onClose,
  onSuccess,
}) => {
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMensagem('');
      setErro(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !vaga) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const candidatura = await candidaturaService.candidatar(vaga.id, {
        mensagemApresentacao: mensagem.trim() || undefined,
      });

      alert('🎉 Candidatura enviada com sucesso! O contratante foi notificado.');
      onSuccess(candidatura);
      setMensagem('');
      onClose();
    } catch (err: unknown) {
      let msg = 'Não foi possível enviar sua candidatura. Tente novamente.';
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
        {/* Cabeçalho */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <span className={styles.badge}>Candidatura</span>
            <h3>{vaga.cargo}</h3>
            <span className={styles.empresa}>{vaga.empresa}</span>
          </div>
          <button
            type="button"
            className={styles.btnClose}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Resumo da Vaga */}
        <div className={styles.resumoVaga}>
          <div className={styles.resumoItem}>
            <Briefcase size={15} />
            <span>{vaga.modalidade || 'Presencial'}</span>
          </div>
          <div className={styles.resumoItem}>
            <MapPin size={15} />
            <span>{vaga.localizacao || 'A combinar'}</span>
          </div>
          <div className={styles.resumoItem}>
            <DollarSign size={15} />
            <span>{vaga.salario || 'A combinar'}</span>
          </div>
          <div className={styles.resumoItem}>
            <Clock size={15} />
            <span>{vaga.horario || 'Horário flexível'}</span>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {erro && <div className={styles.alertaErro}>{erro}</div>}

          <div className={styles.campo}>
            <label htmlFor="mensagemApresentacao">
              Mensagem de Apresentação ou Proposta <span className={styles.opcional}>(opcional)</span>
            </label>
            <textarea
              id="mensagemApresentacao"
              rows={4}
              placeholder="Ex: Olá! Tenho disponibilidade imediata e experiência prática com as competências desta oportunidade..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={500}
              disabled={enviando}
            />
            <span className={styles.contadorCaracteres}>
              {mensagem.length}/500 caracteres
            </span>
          </div>

          <div className={styles.dica}>
            💡 Uma mensagem clara e objetiva aumenta suas chances de ser chamado para o chat.
          </div>

          {/* Rodapé / Ações */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={onClose}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnConfirmar}
              disabled={enviando}
            >
              {enviando ? (
                'Enviando...'
              ) : (
                <>
                  <Send size={16} /> Confirmar Candidatura
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
