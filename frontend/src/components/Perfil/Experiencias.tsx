import React from 'react';

import type { Experiencia } from '../../types/perfil';

import styles from './Experiencias.module.css';

interface Props {
  experiencias: Experiencia[];
  onAdicionar: () => void;
  onEditar: (index: number) => void;
  onExcluir: (index: number) => void;
}

export const Experiencias: React.FC<Props> = ({
  experiencias,
  onAdicionar,
  onEditar,
  onExcluir,
}) => {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        <h6>Experiências Profissionais</h6>

        <button
          className={styles.action}
          onClick={onAdicionar}
        >
          <i className="fas fa-plus" />
        </button>
      </div>

      {experiencias.length === 0 ? (
        <p className={styles.placeholder}>
          Nenhuma experiência cadastrada.
        </p>
      ) : (
        experiencias.map((experiencia, index) => (
          <div className={styles.item} key={index}>

            <i className="fas fa-briefcase" />

            <div>
              <b>{experiencia.cargo}</b>

              <small>
                {experiencia.empresa} · {experiencia.periodo}
              </small>

              {experiencia.descricao && (
                <small className={styles.descricao}>
                  {experiencia.descricao}
                </small>
              )}
            </div>

            <div className={styles.acoes}>

              <button
                onClick={() => onEditar(index)}
              >
                <i className="fas fa-pen" />
              </button>

              <button
                onClick={() => onExcluir(index)}
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