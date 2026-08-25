import React from 'react';

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
        >
          <i className="fas fa-plus" />
        </button>
      </div>

      {formacoes.length === 0 ? (
        <p className={styles.placeholder}>
          Nenhuma formação cadastrada.
        </p>
      ) : (
        formacoes.map((formacao, index) => (
          <div className={styles.item} key={index}>

            <i className="fas fa-university" />

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
                <i className="fas fa-pen" />
              </button>

              <button
                onClick={() => onExcluir(index)}
                title="Excluir"
              >
                <i className="fas fa-trash" />
              </button>

            </div>

          </div>
        ))
      )}

    </section>
  );
};