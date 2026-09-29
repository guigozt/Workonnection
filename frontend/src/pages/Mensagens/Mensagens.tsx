import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Send,
  Check,
  CheckCheck,
  MessageSquare,
  ArrowLeft,
  User,
} from 'lucide-react';
import { Topbar } from '../../components/Topbar/Topbar';
import { useChat } from './useChat';
import styles from './Mensagens.module.css';

export const Mensagens: React.FC = () => {
  const {
    usuarioLogado,
    conversas,
    contatoSelecionado,
    mensagens,
    carregandoConversas,
    carregandoMensagens,
    enviando,
    textoMensagem,
    setTextoMensagem,
    filtroBusca,
    setFiltroBusca,
    selecionarContato,
    enviarMensagem,
    fimMensagensRef,
  } = useChat();

  const [mostrarConversaMobile, setMostrarConversaMobile] = useState(false);

  const handleSelecionarContato = (contato: typeof contatoSelecionado) => {
    if (!contato) return;
    selecionarContato(contato);
    setMostrarConversaMobile(true);
  };

  const handleVoltarListaMobile = () => {
    setMostrarConversaMobile(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const formatarHora = (dataIso: string) => {
    if (!dataIso) return '';
    try {
      const data = new Date(dataIso);
      return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatarDataOuHoraConversa = (dataIso: string) => {
    if (!dataIso) return '';
    try {
      const data = new Date(dataIso);
      const hoje = new Date();
      const mesmoDia =
        data.getDate() === hoje.getDate() &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear();

      if (mesmoDia) {
        return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return data.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className={styles.chatPageContainer}>
      <Topbar />

      <main className={styles.chatMainWrapper}>
        <div className={styles.chatCard}>
          {/* =========================================
              Sidebar / Lista de Conversas
              ========================================= */}
          <aside
            className={`${styles.sidebar} ${
              mostrarConversaMobile && contatoSelecionado ? styles.esconderMobile : ''
            }`}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitulo}>Mensagens</div>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Pesquisar conversas..."
                  className={styles.searchInput}
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.conversasLista}>
              {carregandoConversas ? (
                <div className={styles.emptyConversas}>Carregando conversas...</div>
              ) : conversas.length === 0 ? (
                <div className={styles.emptyConversas}>
                  <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p>Nenhuma conversa encontrada.</p>
                </div>
              ) : (
                conversas.map((c) => {
                  const ativo = contatoSelecionado?.id === c.contato.id;
                  const nome = c.contato.nome || 'Usuário';
                  const fotoUrl =
                    c.contato.perfil?.site ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      nome
                    )}&background=47a4c4&color=fff`;

                  return (
                    <div
                      key={c.contato.id}
                      className={`${styles.conversaItem} ${ativo ? styles.ativo : ''}`}
                      onClick={() => handleSelecionarContato(c.contato)}
                    >
                      <div className={styles.avatarWrapper}>
                        <img src={fotoUrl} alt={nome} className={styles.avatarImg} />
                      </div>

                      <div className={styles.conversaInfo}>
                        <div className={styles.conversaTopo}>
                          <span className={styles.conversaNome}>{nome}</span>
                          <span className={styles.conversaHora}>
                            {formatarDataOuHoraConversa(c.ultimaMensagem?.dataEnvio)}
                          </span>
                        </div>

                        <div className={styles.conversaPreview}>
                          <span className={styles.ultimaMensagemTexto}>
                            {c.ultimaMensagem?.conteudo || 'Iniciar conversa...'}
                          </span>
                          {c.naoLidasCount > 0 && (
                            <span className={styles.badgeNaoLidas}>
                              {c.naoLidasCount > 99 ? '99+' : c.naoLidasCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* =========================================
              Painel Central da Conversa Ativa
              ========================================= */}
          <section
            className={`${styles.painelChat} ${
              !mostrarConversaMobile && !contatoSelecionado ? styles.esconderMobile : ''
            }`}
          >
            {contatoSelecionado ? (
              <>
                {/* Header da Conversa */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderUsuario}>
                    <button
                      type="button"
                      onClick={handleVoltarListaMobile}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'none',
                      }}
                      className={styles.btnVoltarMobile}
                    >
                      <ArrowLeft size={20} color="#1e293b" />
                    </button>

                    <div className={styles.avatarWrapper} style={{ width: 40, height: 40 }}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          contatoSelecionado.nome || 'Usuário'
                        )}&background=47a4c4&color=fff`}
                        alt={contatoSelecionado.nome}
                        className={styles.avatarImg}
                      />
                    </div>

                    <div className={styles.chatHeaderDetalhes}>
                      <h3>{contatoSelecionado.nome}</h3>
                      <span>{contatoSelecionado.tipoUsuario || 'Membro'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/perfil/${contatoSelecionado.id}`}
                    className={styles.btnPerfilHeader}
                  >
                    <User size={14} />
                    Ver Perfil
                  </Link>
                </div>

                {/* Histórico com Balões */}
                <div className={styles.historicoMensagens}>
                  {carregandoMensagens ? (
                    <div className={styles.emptyConversas}>Carregando mensagens...</div>
                  ) : mensagens.length === 0 ? (
                    <div className={styles.emptyConversas}>
                      <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                      <p>Envie uma mensagem para iniciar o contato com {contatoSelecionado.nome}!</p>
                    </div>
                  ) : (
                    mensagens.map((msg) => {
                      const souRemetente =
                        String(msg.remetenteId) === String(usuarioLogado?.id);

                      return (
                        <div
                          key={msg.id}
                          className={`${styles.linhaMensagem} ${
                            souRemetente ? styles.enviada : styles.recebida
                          }`}
                        >
                          <div className={styles.balaoMensagem}>
                            {msg.conteudo}
                          </div>

                          <div className={styles.mensagemMeta}>
                            <span>{formatarHora(msg.dataEnvio)}</span>
                            {souRemetente && (
                              <span
                                className={`${styles.iconeStatus} ${
                                  msg.lida ? styles.lida : ''
                                }`}
                              >
                                {msg.lida ? (
                                  <CheckCheck size={14} />
                                ) : (
                                  <Check size={13} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={fimMensagensRef} />
                </div>

                {/* Input de Envio */}
                <div className={styles.chatFooter}>
                  <div className={styles.campoTextoWrapper}>
                    <input
                      type="text"
                      className={styles.campoTexto}
                      placeholder="Digite sua mensagem... (Pressione Enter para enviar)"
                      value={textoMensagem}
                      onChange={(e) => setTextoMensagem(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={enviando}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.btnEnviar}
                    onClick={enviarMensagem}
                    disabled={!textoMensagem.trim() || enviando}
                    title="Enviar Mensagem"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.vazioPlaceholder}>
                <MessageSquare size={54} color="#94a3b8" />
                <h4>Suas Conversas</h4>
                <p>
                  Selecione uma conversa ao lado ou inicie uma conversa diretamente no perfil de um colaborador!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Mensagens;
