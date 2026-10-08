import React from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';

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
          title="Adicionar experiência"
        >
          <Plus size={15} />
        </button>
      </div>

      {experiencias.length === 0 ? (
        <p className={styles.placeholder}>
          Nenhuma experiência cadastrada.
        </p>
      ) : (
        experiencias.map((experiencia, index) => (
          <div className={styles.item} key={index}>

            <Briefcase size={20} className={styles.icone} />

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