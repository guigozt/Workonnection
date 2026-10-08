import React from 'react';
import { Search, X, RotateCcw, Filter, Briefcase, GraduationCap } from 'lucide-react';
import { obterTraducoes } from '../../utils/i18n';
import styles from './FiltroVagas.module.css';

export interface FiltroVagasProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  modalidade: string;
  onModalidadeChange: (valor: string) => void;
  tipo: string;
  onTipoChange: (valor: string) => void;
  onLimparFiltros: () => void;
  temFiltrosAtivos: boolean;
  totalVagas?: number;
  tipoUsuarioLogado?: string;
}

export const FiltroVagas: React.FC<FiltroVagasProps> = ({
  busca,
  onBuscaChange,
  modalidade,
  onModalidadeChange,
  tipo,
  onTipoChange,
  onLimparFiltros,
  temFiltrosAtivos,
  totalVagas,
  tipoUsuarioLogado,
}) => {
  const t = obterTraducoes();

  const MODALIDADES = [
    { valor: 'Todos', label: t.filtroTodos },
    { valor: 'Presencial', label: t.filtroPresencial },
    { valor: 'Remoto', label: t.filtroRemoto },
    { valor: 'Híbrido', label: t.filtroHibrido },
  ];

  const isEstudante =
    tipoUsuarioLogado?.toLowerCase() === 'estudante' ||
    tipoUsuarioLogado?.toLowerCase() === 'aluno';

  const tiposDisponiveis = isEstudante
    ? [
        { valor: 'Todos', label: t.filtroTodos },
        { valor: 'Estudante', label: t.filtroEstudante },
      ]
    : [
        { valor: 'Todos', label: t.filtroTodos },
        { valor: 'Prestador', label: t.filtroPrestador },
        { valor: 'Estudante', label: t.filtroEstudante },
      ];

  return (
    <section className={styles.filtroContainer} aria-label="Filtros de vagas">
      {/* Campo de Busca Textual */}
      <div className={styles.searchRow}>
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.filtroBuscaPlaceholder}
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
          />
          {busca && (
            <button
              type="button"
              className={styles.clearInputBtn}
              onClick={() => onBuscaChange('')}
              title="Limpar"
              aria-label="Limpar"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {temFiltrosAtivos && (
          <button
            type="button"
            className={styles.btnLimpar}
            onClick={onLimparFiltros}
            title={t.limparFiltros}
          >
            <RotateCcw size={14} />
            <span>{t.limparFiltros}</span>
          </button>
        )}
      </div>

      {/* Grupos de Filtros (Modalidade e Tipo de Usuário) */}
      <div className={styles.filterGroups}>
        {/* Filtro: Modalidade */}
        <div className={styles.filterGroup}>
          <div className={styles.groupLabel}>
            <Briefcase size={14} />
            <span>{t.filtroModalidade}:</span>
          </div>
          <div className={styles.chipsList}>
            {MODALIDADES.map((item) => {
              const ativo = modalidade === item.valor || (!modalidade && item.valor === 'Todos');
              return (
                <button
                  type="button"
                  key={item.valor}
                  className={`${styles.chip} ${ativo ? styles.chipAtivo : ''}`}
                  onClick={() => onModalidadeChange(item.valor)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro: Tipo de Usuário */}
        <div className={styles.filterGroup}>
          <div className={styles.groupLabel}>
            <GraduationCap size={14} />
            <span>{t.filtroTipo}:</span>
          </div>
          <div className={styles.chipsList}>
            {tiposDisponiveis.map((item) => {
              const ativo = tipo === item.valor || (!tipo && item.valor === 'Todos');
              return (
                <button
                  type="button"
                  key={item.valor}
                  className={`${styles.chip} ${ativo ? styles.chipAtivo : ''}`}
                  onClick={() => onTipoChange(item.valor)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de resumo de status e contagem */}
      {temFiltrosAtivos && (
        <div className={styles.statusBar}>
          <div className={styles.statusInfo}>
            <Filter size={13} />
            <span>Filtros ativos aplicados</span>
            {typeof totalVagas === 'number' && (
              <span className={styles.countBadge}>
                {totalVagas} {totalVagas === 1 ? 'vaga encontrada' : 'vagas encontradas'}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
