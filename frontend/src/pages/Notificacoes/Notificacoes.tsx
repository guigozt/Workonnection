import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/Topbar/Topbar';

import {
  Bell,
  Briefcase,
  CheckCheck,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';

import type {
  Notificacao,
  TipoNotificacao,
} from '../../types/notificacao';

import { useNotificacoes } from './useNotificacoes';

import styles from './Notificacoes.module.css';

export const Notificacoes = () => {
  const navigate = useNavigate();

  const {
    notificacoes,
    loading,
    erro,
    quantidadeNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
    limparTodas,
  } = useNotificacoes();
  

  const formatarTempo = (instante: string) => {
    if (!instante) {
      return '';
    }

    const diff =
      Date.now() - new Date(instante).getTime();

    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) {
      return 'Agora mesmo';
    }

    if (minutos < 60) {
      return `${minutos} min atrás`;
    }

    if (horas < 24) {
      return `${horas}h atrás`;
    }

    if (dias === 1) {
      return 'Ontem';
    }

    if (dias < 7) {
      return `${dias} dias atrás`;
    }

    return new Date(instante).toLocaleDateString('pt-BR');
  };

  const obterIcone = (tipo: TipoNotificacao) => {
    switch (tipo) {
      case 'like':
        return <ThumbsUp size={18} />;

      case 'dislike':
        return <ThumbsDown size={18} />;

      case 'comentario':
        return <MessageCircle size={18} />;

      case 'vaga_nova':
        return <Briefcase size={18} />;

      default:
        return <Bell size={18} />;
    }
  };

  const clicarNotificacao = async (
    notificacao: Notificacao
  ) => {
    if (!notificacao.lida) {
      await marcarComoLida(notificacao.id);
    }

    if (notificacao.vagaId) {
      navigate('/home');
    }
  };

  const handleLimparTodas = async () => {
    const confirmou = window.confirm(
      'Limpar todas as notificações?'
    );

    if (!confirmou) {
      return;
    }

    await limparTodas();
  };

  if (loading) {
    return (
      <>
        <Topbar notificacoesNaoLidas={0} />

        <main className={styles.wrapper}>
          <p>Carregando notificações...</p>
        </main>
      </>
    );
  }

   return (
    <>
      <Topbar
        notificacoesNaoLidas={quantidadeNaoLidas}
      />

      <main className={styles.wrapper}>
        <header className={styles.header}>
          <h1>Notificações</h1>

          <div className={styles.acoes}>
            <button
              type="button"
              className={styles.botaoAcao}
              onClick={marcarTodasComoLidas}
            >
              <CheckCheck size={15} />
              Marcar todas como lidas
            </button>

            <button
              type="button"
              className={`${styles.botaoAcao} ${styles.danger}`}
              onClick={handleLimparTodas}
            >
              <Trash2 size={15} />
              Limpar tudo
            </button>
          </div>
        </header>

        {erro && (
          <p className={styles.erro}>
            {erro}
          </p>
        )}

        {!erro && notificacoes.length === 0 && (
          <div className={styles.vazio}>
            <Bell size={32} />

            <p>
              Nenhuma notificação por enquanto.
            </p>
          </div>
        )}

        {!erro && notificacoes.length > 0 && (
          <div className={styles.lista}>
            {notificacoes.map((notificacao) => (
              <article
                key={notificacao.id}
                className={`${styles.card} ${
                  !notificacao.lida
                    ? styles.naoLida
                    : ''
                }`}
                onClick={() =>
                  clicarNotificacao(notificacao)
                }
              >
                <div
                  className={`${styles.icone} ${
                    styles[notificacao.tipo]
                  }`}
                >
                  {obterIcone(notificacao.tipo)}
                </div>

                <div className={styles.corpo}>
                  <div className={styles.mensagem}>
                    {notificacao.mensagem}
                  </div>

                  <div className={styles.tempo}>
                    {formatarTempo(
                      notificacao.criadaEm
                    )}
                  </div>
                </div>

                {!notificacao.lida && (
                  <div
                    className={styles.ponto}
                    title="Não lida"
                  />
                )}

                <button
                  type="button"
                  className={styles.botaoExcluir}
                  title="Excluir"
                  onClick={(event) => {
                    event.stopPropagation();

                    excluirNotificacao(
                      notificacao.id
                    );
                  }}
                >
                  <X size={14} />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
};