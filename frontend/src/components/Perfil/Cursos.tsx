import React from 'react';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';

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
          title="Adicionar curso"
        >
          <Plus size={15} />
        </button>
      </div>

      {cursos.length === 0 ? (
        <p className={styles.placeholder}>
          Nenhum curso cadastrado.
        </p>
      ) : (
        cursos.map((curso, index) => (
          <div className={styles.item} key={index}>

            <Award size={20} className={styles.icone} />

            <div>
              <b>{curso.nome}</b>

              <small>
                {curso.instituicao} · {curso.periodo}
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