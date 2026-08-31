import React from 'react';

import {
  Pencil,
  Trash2,
  Laptop,
  MapPin,
  Clock,
  CircleDollarSign,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
} from 'lucide-react';

import type {
  VagaResponseDTO,
  UsuarioLogado,
} from '../../types/vagas';

import styles from './VagaCard.module.css';

const FOTO_DEFAULT =
  'https://newcastle-online.org/uploads/set%5C_resources%5C_2/84c1e40ea0e759e3f1505eb1788ddf3c%5C_default%5C_photo.png';

interface VagaCardProps {
  vaga: VagaResponseDTO;
  usuarioLogado?: UsuarioLogado | null;
  compacto?: boolean;

  // Propriedade que ativa a prévia
  onLike: (vagaId: string) => void;
  onDislike: (vagaId: string) => void;
  onAbrirComentarios: (vaga: VagaResponseDTO) => void;

  onEditar?: (vaga: VagaResponseDTO) => void;
  onExcluir?: (vagaId: string, cargo: string) => void;
}

export const VagaCard: React.FC<VagaCardProps> = ({
  vaga,
  usuarioLogado,
  compacto = false, // Padrão é false (para a Home)

  onLike,
  onDislike,
  onAbrirComentarios,
  onEditar,
  onExcluir,
}) => {
  const isDono = Boolean(
    usuarioLogado && vaga.usuarioId === usuarioLogado.id
  );

  const podeSeCandidar = (): boolean => {
    if (!usuarioLogado || isDono) return false;

    const tipos = vaga.tiposUsuario || [];

    if (!tipos.length || tipos.includes('todos')) {
      return true;
    }

    const tipo = (
      usuarioLogado.tipoUsuario || ''
    ).toLowerCase();

    if (
      tipos.includes('prestador') &&
      ['empresa', 'mei', 'me'].includes(tipo)
    ) {
      return true;
    }

    if (
      tipos.includes('estudante') &&
      tipo === 'estudante'
    ) {
      return true;
    }

    return false;
  };

  const labelTipos = (tipos?: string[]): string[] => {
    if (!tipos?.length || tipos.includes('todos')) {
      return ['Todos'];
    }

    return tipos.map((t) =>
      t === 'prestador'
        ? 'Prestadores'
        : 'Estudantes'
    );
  };

  const podeCand = podeSeCandidar();
  const chips = labelTipos(vaga.tiposUsuario);

  const euCurtiu = Boolean(
    usuarioLogado &&
      vaga.likes?.includes(usuarioLogado.id)
  );

  const euDescurtiu = Boolean(
    usuarioLogado &&
      vaga.dislikes?.includes(usuarioLogado.id)
  );

  const nLikes = vaga.likes?.length || 0;
  const nDislikes = vaga.dislikes?.length || 0;
  const nComentarios = vaga.comentarios?.length || 0;

  return (
    <div
      className={styles.vagaCard}
      data-vaga-id={vaga.id}
    >
      <div className={styles.header}>
        <img
          className={styles.avatar}
          src={FOTO_DEFAULT}
          alt="Foto do autor"
        />

        <div className={styles.autor}>
          <div className={styles.autorNome}>
            {vaga.nomeUsuario || 'Usuário'}
          </div>

          <div className={styles.autorMeta}>
            {vaga.empresa}
            {vaga.data ? ` · ${vaga.data}` : ''}
          </div>
        </div>

        {isDono && (
          <div className={styles.headerAcoes}>
            <button
              className={`${styles.btnIcone} ${styles.btnEditar}`}
              title="Editar"
              onClick={() => onEditar?.(vaga)}
            >
              <Pencil size={18} />
            </button>

            <button
              className={`${styles.btnIcone} ${styles.btnExcluir}`}
              title="Excluir"
              onClick={() =>
                onExcluir?.(vaga.id, vaga.cargo)
              }
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.cargo}>
          {vaga.cargo}
        </div>

        <div className={styles.empresaNome}>
          {vaga.empresa}
        </div>

        {/* O segredo da Prévia está aqui: esconde se for compacto */}
        {!compacto && (
          <>
            <p className={styles.descricao}>
              {vaga.descricao}
            </p>

            <div className={styles.detalhes}>
              <div className={styles.detalheBloco}>
                <div className={styles.detalheLabel}>
                  Benefícios
                </div>

                <div className={styles.detalheValor}>
                  {vaga.beneficios || '—'}
                </div>
              </div>

              <div className={styles.detalheBloco}>
                <div className={styles.detalheLabel}>
                  Requisitos
                </div>

                <div className={styles.detalheValor}>
                  {vaga.requisitos || '—'}
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.tags}>
          <span className={styles.tag}>
            <Laptop
              size={14}
              className={styles.tagIcone}
            />
            {vaga.modalidade}
          </span>

          <span className={styles.tag}>
            <MapPin
              size={14}
              className={styles.tagIcone}
            />
            {vaga.localizacao}
          </span>

          <span className={styles.tag}>
            <Clock
              size={14}
              className={styles.tagIcone}
            />
            {vaga.horario}
          </span>

          <span className={styles.tag}>
            <CircleDollarSign
              size={14}
              className={styles.tagIcone}
            />
            {vaga.salario}
          </span>
        </div>

        <div className={styles.chips}>
          {chips.map((chip, idx) => (
            <span
              key={idx}
              className={styles.chip}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.acoes}>
        <button
          className={`${styles.acaoBtn} ${
            euCurtiu ? styles.liked : ''
          }`}
          onClick={() => onLike(vaga.id)}
        >
          <ThumbsUp
            size={18}
            fill={
              euCurtiu
                ? 'currentColor'
                : 'none'
            }
          />

          <span>{nLikes}</span>
        </button>

        <button
          className={`${styles.acaoBtn} ${
            euDescurtiu
              ? styles.disliked
              : ''
          }`}
          onClick={() => onDislike(vaga.id)}
        >
          <ThumbsDown
            size={18}
            fill={
              euDescurtiu
                ? 'currentColor'
                : 'none'
            }
          />

          <span>{nDislikes}</span>
        </button>

        <button
          className={styles.acaoBtn}
          onClick={() =>
            onAbrirComentarios(vaga)
          }
        >
          <MessageCircle size={18} />

          <span>{nComentarios}</span>
        </button>

        <span className={styles.spacer} />

        {isDono ? (
          <span
            className={`${styles.btnCandidatar} ${styles.candidatarDono}`}
          >
            Sua vaga
          </span>
        ) : podeCand ? (
          <a
            href={`mailto:${vaga.email || ''}`}
            className={styles.candidatarAtivo}
          >
            Candidatar-se
          </a>
        ) : (
          <span
            className={styles.candidatarBloqueado}
          >
            Fora do perfil
          </span>
        )}
      </div>
    </div>
  );
};