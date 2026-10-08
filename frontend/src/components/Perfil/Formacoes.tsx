import React from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';

import type { Formacao } from '../../types/perfil';

import styles from './Formacoes.module.css';

interface Props {
  formacoes: Formacao[];
  onAdicionar: () => void;
  onEditar: (index: number) => void;
  onExcluir: (index: number) => void;
}

export const Formacoes: React.FC<Props> = ({
  formacoes,
  onAdicionar,
  onEditar,
  onExcluir,
}) => {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        <h6>Formação Acadêmica</h6>

        <button
          className={styles.action}
          onClick={onAdicionar}
          title="Adicionar formação"
        >
          <Plus size={15} />
        </button>
      </div>

      {formacoes.length === 0 ? (
        <p className={styles.placeholder}>
          Nenhuma formação cadastrada.
        </p>
      ) : (
        formacoes.map((formacao, index) => (
          <div className={styles.item} key={index}>

            <GraduationCap size={20} className={styles.icone} />

            <div>
              <b>{formacao.curso}</b>

              <small>
                {formacao.universidade} · {formacao.periodo}
              </small>
            </div>

            <div className={styles.acoes}>

              <button
                onClick={() => onEditar(index)}
                title="Editar"
              >
                <Pencil size={13} />
              </button>

              <button
                onClick={() => onExcluir(index)}
                title="Excluir"
              >
                <Trash2 size={13} />
              </button>

            </div>

          </div>
        ))
      )}

    </section>
  );
};