import React from 'react';
import { Search, X, RotateCcw, Filter, Briefcase, GraduationCap } from 'lucide-react';
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
}

const MODALIDADES = ['Todos', 'Presencial', 'Remoto', 'Híbrido'];
const TIPOS_USUARIO = ['Todos', 'Aluno', 'Egresso', 'Professor'];

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
}) => {
  return (
    <section className={styles.filtroContainer} aria-label="Filtros de vagas">
      {/* Campo de Busca Textual */}
      <div className={styles.searchRow}>
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por cargo, empresa, tecnologia..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
          />
          {busca && (
            <button
              type="button"
              className={styles.clearInputBtn}
              onClick={() => onBuscaChange('')}
              title="Limpar texto da busca"
              aria-label="Limpar texto da busca"
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
            title="Restaurar todos os filtros"
          >
            <RotateCcw size={14} />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Grupos de Filtros (Modalidade e Tipo de Usuário) */}
      <div className={styles.filterGroups}>
        {/* Filtro: Modalidade */}
        <div className={styles.filterGroup}>
          <div className={styles.groupLabel}>
            <Briefcase size={14} />
            <span>Modalidade:</span>
          </div>
          <div className={styles.chipsList}>
            {MODALIDADES.map((item) => {
              const ativo = modalidade === item || (!modalidade && item === 'Todos');
              return (
                <button
                  type="button"
                  key={item}
                  className={`${styles.chip} ${ativo ? styles.chipAtivo : ''}`}
                  onClick={() => onModalidadeChange(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro: Tipo de Usuário */}
        <div className={styles.filterGroup}>
          <div className={styles.groupLabel}>
            <GraduationCap size={14} />
            <span>Público-alvo:</span>
          </div>
          <div className={styles.chipsList}>
            {TIPOS_USUARIO.map((item) => {
              const ativo = tipo === item || (!tipo && item === 'Todos');
              return (
                <button
                  type="button"
                  key={item}
                  className={`${styles.chip} ${ativo ? styles.chipAtivo : ''}`}
                  onClick={() => onTipoChange(item)}
                >
                  {item}
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
