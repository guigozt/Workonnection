import React from 'react';
import { MapPin, Phone, Globe } from 'lucide-react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa6';

import type { PerfilData } from '../../types/perfil';

import styles from './Contato.module.css';

interface Props {
  perfil: PerfilData;
}

export const Contatos: React.FC<Props> = ({
  perfil,
}) => {
  return (
    <div className={styles.grid}>

      <a href="#" className={styles.item}>
        <MapPin size={16} />
        <span>{perfil.local || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <Phone size={16} />
        <span>{perfil.telefone || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <FaInstagram size={16} />
        <span>{perfil.instagram || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <FaLinkedin size={16} />
        <span>{perfil.linkedin || '—'}</span>
      </a>

      <a href="#" className={styles.item}>
        <Globe size={16} />
        <span>{perfil.site || '—'}</span>
      </a>

    </div>
  );
};