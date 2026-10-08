import React, { useRef } from 'react';
import { Camera, Pencil } from 'lucide-react';
import type { UsuarioPerfil } from '../../types/perfil';
import { obterUrlArquivo } from '../../utils/documentosPorCategoria';
import styles from './PerfilHeader.module.css';

interface Props {
  usuario: UsuarioPerfil;
  onEditarContatos: () => void;
  onUploadFoto?: (arquivo: File) => Promise<void>;
  carregandoFoto?: boolean;
}

export const PerfilHeader: React.FC<Props> = ({
  usuario,
  onEditarContatos,
  onUploadFoto,
  carregandoFoto = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fotoSrc =
    usuario.perfil?.fotoPerfil?.url
      ? obterUrlArquivo(usuario.perfil.fotoPerfil.url)
      : usuario.foto
      ? obterUrlArquivo(usuario.foto)
      : 'https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png';

  const handleFotoClick = () => {
    if (!carregandoFoto && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extensoesValidas = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!extensoesValidas.includes(file.type)) {
      alert('Selecione uma imagem válida (PNG, JPG ou JPEG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    if (onUploadFoto) {
      await onUploadFoto(file);
    }

    // Limpa valor para permitir selecionar o mesmo arquivo se quiser
    e.target.value = '';
  };

  return (
    <div className={styles.header}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      <div
        className={styles.fotoContainer}
        onClick={handleFotoClick}
        title="Clique para alterar a foto de perfil"
      >
        <img
          className={styles.foto}
          src={fotoSrc}
          alt={usuario.nome || 'Foto do perfil'}
        />

        <div className={styles.btnCameraBadge}>
          {carregandoFoto ? (
            <i className={`fas fa-spinner ${styles.spinner}`} />
          ) : (
            <Camera size={14} />
          )}
        </div>

        <div className={styles.fotoOverlay}>
          {carregandoFoto ? (
            <i className={`fas fa-spinner ${styles.spinner}`} />
          ) : (
            <>
              <Camera size={20} />
              <span>Trocar</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.dados}>
        <h5>{usuario.nome || '—'}</h5>
        <small>{usuario.email || '—'}</small>

        <div className={styles.badge}>
          {usuario.tipoUsuario?.toUpperCase() || ''}
        </div>
      </div>

      <button
        className={styles.editar}
        title="Editar contatos"
        onClick={onEditarContatos}
      >
        <Pencil size={15} />
      </button>
    </div>
  );
};