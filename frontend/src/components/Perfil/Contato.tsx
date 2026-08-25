import React from 'react';

import type { PerfilData } from '../../types/perfil';

import styles from './Contatos.module.css';

interface Props {
  perfil: PerfilData;
}

export const Contatos: React.FC<Props> = ({
  perfil,
}) => {
  return (
    <div className={styles.grid}>

      <a href="#" className={styles.item}>
        <i className="fas fa-map-marker-alt" />
        <span>{perfil.local || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <i className="fas fa-phone" />
        <span>{perfil.telefone || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <i className="fab fa-instagram" />
        <span>{perfil.instagram || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <i className="fab fa-linkedin" />
        <span>{perfil.linkedin || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <i className="fas fa-globe" />
        <span>{perfil.site || '—'}</span>
      </a>

    </div>
  );
};