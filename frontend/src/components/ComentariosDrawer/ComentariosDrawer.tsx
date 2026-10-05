import React, { useState, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { isAxiosError } from 'axios';
import type { VagaResponseDTO, UsuarioLogado } from '../../types/vagas';
import styles from './ComentariosDrawer.module.css';

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
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!vaga) return null;

  const comentarios = vaga.comentarios || [];

  const handleResponder = (nomeUsuario: string) => {
    const mencao = `@${nomeUsuario} `;
    setTexto((prev) => (prev.startsWith(mencao) ? prev : `${mencao}${prev}`));
    setErro(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleEnviar = async () => {
    if (!texto.trim() || enviando) return;
    try {
      setEnviando(true);
      setErro(null);
      await onEnviarComentario(vaga.id, texto.trim());
      setTexto('');
    } catch (err: unknown) {
      console.error(err);
      let mensagemErro = 'Não foi possível enviar a resposta. Tente novamente.';
      if (isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        mensagemErro = err.response.data.message;
      }
      setErro(mensagemErro);
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
                    <div className={styles.comentarioMeta}>
                      <button
                        className={styles.btnResponderComentario}
                        onClick={() => handleResponder(c.nomeUsuario || 'Usuário')}
                      >
                        Responder
                      </button>
                      {podeExcluir && c.id && (
                        <button
                          className={styles.btnExcluirComentario}
                          onClick={() => onExcluirComentario(vaga.id, c.id!)}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {erro && <p className={styles.erroComentario}>{erro}</p>}

        <div className={styles.footer}>
          <input
            ref={inputRef}
            className={styles.inputComentario}
            placeholder="Adicione um comentário ou resposta..."
            maxLength={500}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              if (erro) setErro(null);
            }}
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