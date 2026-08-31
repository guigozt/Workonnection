import React from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UsuarioResponseDTO } from '../../types/usuarios';
import styles from './UsuarioCard.module.css';

interface UsuarioCardProps {
  usuario: UsuarioResponseDTO;
  compacto?: boolean;
}

export const UsuarioCard: React.FC<UsuarioCardProps> = ({
  usuario,
  compacto = false,
}) => {
  const nome = usuario.nome || 'Usuário';
  const tipo = usuario.tipoUsuario || 'Membro';

  const perfil = usuario.perfil || {};
  const local = perfil.local || 'Não informado';
  const habilidades = perfil.habilidades || [];

  const fotoUrl =
    perfil.foto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nome
    )}&background=47a4c4&color=fff`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img
          className={styles.avatar}
          src={fotoUrl}
          alt={nome}
        />

        <div className={styles.autor}>
          <div className={styles.autorNome}>
            {nome}
          </div>

          <div className={styles.autorMeta}>
            {tipo.toLowerCase()}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.cargoTitle}>
          {nome}
        </div>

        {!compacto && (
          <>
            <div className={styles.detalhes}>
              <div className={styles.detalheBloco}>
                <div className={styles.detalheLabel}>
                  Categoria
                </div>

                <div className={styles.detalheValor}>
                  {tipo}
                </div>
              </div>

              <div className={styles.detalheBloco}>
                <div className={styles.detalheLabel}>
                  Localização
                </div>

                <div className={styles.detalheValor}>
                  {local}
                </div>
              </div>
            </div>

            <div className={styles.tags}>
              {habilidades.length > 0 ? (
                habilidades.map((h, idx) => (
                  <span
                    key={idx}
                    className={styles.tag}
                  >
                    <Check
                      size={12}
                      color="#47a4c4"
                    />
                    {h}
                  </span>
                ))
              ) : (
                <span className={styles.tag}>
                  Perfil Geral
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className={styles.acoes}>
        <button className={styles.acaoBtn}>
          <MessageCircle size={18} />
          Mensagem
        </button>

        <span className={styles.spacer}></span>

        <Link
          to={`/perfil/${usuario.id}`}
          className={styles.btnPerfil}
        >
          Ver Perfil
        </Link>
      </div>
    </div>
  );
};