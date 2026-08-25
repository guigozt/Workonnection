import React from 'react';

import type { Curso } from '../../types/perfil';

import styles from './Cursos.module.css';

interface Props {
  cursos: Curso[];
  onAdicionar: () => void;
  onEditar: (index: number) => void;
  onExcluir: (index: number) => void;
}

export const Cursos: React.FC<Props> = ({
  cursos,
  onAdicionar,
  onEditar,
  onExcluir,
}) => {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        <h6>Cursos e Certificados</h6>

        <button
          className={styles.action}
          onClick={onAdicionar}
        >
          <i className="fas fa-plus" />
        </button>
      </div>

      {cursos.length === 0 ? (
        <p className={styles.placeholder}>
          Nenhum curso cadastrado.
        </p>
      ) : (
        cursos.map((curso, index) => (
          <div className={styles.item} key={index}>

            <i className="fas fa-graduation-cap" />

            <div>
              <b>{curso.nome}</b>

              <small>
                {curso.instituicao} · {curso.periodo}
              </small>
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