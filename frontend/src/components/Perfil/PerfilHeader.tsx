import React from 'react';

import type { UsuarioPerfil } from '../../types/perfil';

import styles from './PerfilHeader.module.css';

interface Props {
  usuario: UsuarioPerfil;
  onEditarContatos: () => void;
}

export const PerfilHeader: React.FC<Props> = ({
  usuario,
  onEditarContatos,
}) => {
  return (
    <div className={styles.header}>

      <img
        className={styles.foto}
        src={
          usuario.foto ||
          'https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png'
        }
        alt="Foto do perfil"
      />

      <div className={styles.dados}>
        <h5>{usuario.nome || '—'}</h5>

        <small>
          {usuario.email || '—'}
        </small>

        <div className={styles.badge}>
          {usuario.tipoUsuario?.toUpperCase() || ''}
        </div>
      </div>

      <button
        className={styles.editar}
        title="Editar contatos"
        onClick={onEditarContatos}
      >
        <i className="fas fa-pen" />
      </button>

    </div>
  );
};