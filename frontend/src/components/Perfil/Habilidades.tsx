import React from 'react';
import { Plus, X } from 'lucide-react';

import styles from './Habilidades.module.css';

interface Props {
  habilidades: string[];
  onAdicionar: () => void;
  onExcluir: (index: number) => void;
}

export const Habilidades: React.FC<Props> = ({
  habilidades,
  onAdicionar,
  onExcluir,
}) => {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        <h6>Habilidades e Conhecimentos</h6>

        <button
          className={styles.action}
          title="Adicionar habilidade"
          onClick={onAdicionar}
        >
          <Plus size={15} />
        </button>
      </div>

      <div className={styles.lista}>

        {habilidades.length === 0 ? (
          <span className={styles.placeholder}>
            Nenhuma habilidade cadastrada.
          </span>
        ) : (
          habilidades.map((habilidade, index) => (
            <span
              className={styles.badge}
              key={`${habilidade}-${index}`}
            >
              {habilidade}

              <button
                type="button"
                onClick={() => onExcluir(index)}
                title="Remover habilidade"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}

      </div>

    </section>
  );
};