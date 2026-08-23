import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { VagaResponseDTO, UsuarioLogado } from '../../types/vagas';
import styles from './ComentariosDrawer.module.css'

const FOTO_DEFAULT =
  "https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png";

interface ComentariosDrawerProps {
  isOpen: boolean;
  vaga: VagaResponseDTO | null;
  usuarioLogado?: UsuarioLogado | null;
  onClose: () => void;
  onEnviarComentario: (vagaId: string, texto: string) => Promise<void>;
  onExcluirComentario: (vagaId: string, comentarioId: string) => Promise<void>;
}

export const ComentariosDrawer: React.FC<ComentariosDrawerProps> = ({
  isOpen,
  vaga,
  usuarioLogado,
  onClose,
  onEnviarComentario,
  onExcluirComentario,
}) => {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!vaga) return null;

  const comentarios = vaga.comentarios || [];

  const handleEnviar = async () => {
    if (!texto.trim() || enviando) return;
    try {
      setEnviando(true);
      await onEnviarComentario(vaga.id, texto.trim());
      setTexto('');
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleEnviar();
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.aberto : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h6>Comentários</h6>
          <button className={styles.btnFechar} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.lista}>
          {comentarios.length === 0 ? (
            <p className={styles.vazio}>
              Nenhum comentário ainda.
              <br />
              Seja o primeiro!
            </p>
          ) : (
            comentarios.map((c, index) => {
              const podeExcluir =
                usuarioLogado &&
                (c.usuarioId === usuarioLogado.id || vaga.usuarioId === usuarioLogado.id);

              return (
                <div key={c.id || index} className={styles.item}>
                  <img
                    className={styles.comentarioAvatar}
                    src={FOTO_DEFAULT}
                    alt="Avatar"
                  />
                  <div className={styles.comentarioCorpo}>
                    <div className={styles.comentarioNome}>
                      {c.nomeUsuario || 'Usuário'}
                    </div>
                    <div className={styles.comentarioTexto}>{c.texto}</div>
                    {podeExcluir && c.id && (
                      <div className={styles.comentarioMeta}>
                        <button
                          className={styles.btnExcluirComentario}
                          onClick={() => onExcluirComentario(vaga.id, c.id!)}
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={styles.footer}>
          <input
            className={styles.inputComentario}
            placeholder="Adicione um comentário..."
            maxLength={500}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.btnEnviar}
            onClick={handleEnviar}
            disabled={enviando}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};