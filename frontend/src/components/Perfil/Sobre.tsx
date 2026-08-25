import React from 'react';

import type { PerfilData } from '../../types/perfil';

import styles from './Sobre.module.css';

interface Props {
  perfil: PerfilData;
  onEditar: () => void;
}

export const Sobre: React.FC<Props> = ({
  perfil,
  onEditar,
}) => {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        <h6>Sobre</h6>

        <button
          className={styles.action}
          title="Editar"
          onClick={onEditar}
        >
          <i className="fas fa-pen" />
        </button>
      </div>

      <p
        className={
          perfil.sobre
            ? styles.conteudo
            : styles.placeholder
        }
      >
        {perfil.sobre ||
          'Clique em editar para adicionar suas informações.'}
      </p>

    </section>
  );
};