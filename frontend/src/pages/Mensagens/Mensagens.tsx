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
  MoreVertical,
  Pencil,
  Trash2,
  X,
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
    editarMensagem,
    excluirMensagem,
    excluirConversa,
    fimMensagensRef,
  } = useChat();

  const [mostrarConversaMobile, setMostrarConversaMobile] = useState(false);
  const [mensagemEmEdicaoId, setMensagemEmEdicaoId] = useState<string | null>(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [menuHeaderAberto, setMenuHeaderAberto] = useState(false);

  const handleSelecionarContato = (contato: typeof contatoSelecionado) => {
    if (!contato) return;
    selecionarContato(contato);
    setMostrarConversaMobile(true);
    setMenuAbertoId(null);
    setMenuHeaderAberto(false);
    setMensagemEmEdicaoId(null);
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

  const iniciarEdicao = (id: string, conteudo: string) => {
    setMensagemEmEdicaoId(id);
    setTextoEdicao(conteudo);
    setMenuAbertoId(null);
  };

  const cancelarEdicao = () => {
    setMensagemEmEdicaoId(null);
    setTextoEdicao('');
  };

  const salvarEdicao = async (id: string) => {
    if (!textoEdicao.trim()) return;
    try {
      await editarMensagem(id, textoEdicao.trim());
      setMensagemEmEdicaoId(null);
      setTextoEdicao('');
    } catch {
      // ignora
    }
  };

  const handleExcluirMensagem = async (id: string) => {
    if (!window.confirm('Deseja excluir esta mensagem para você?')) return;
    try {
      await excluirMensagem(id);
      setMenuAbertoId(null);
    } catch {
      // ignora
    }
  };

  const handleExcluirConversa = async () => {
    if (!contatoSelecionado) return;
    if (
      !window.confirm(
        `Tem certeza de que deseja apagar o histórico da conversa com ${contatoSelecionado.nome}? As mensagens serão excluídas apenas para você.`
      )
    ) {
      return;
    }
    try {
      await excluirConversa(String(contatoSelecionado.id));
      setMenuHeaderAberto(false);
    } catch {
      // ignora
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

                  <div className={styles.headerAcoes}>
                    <Link
                      to={`/perfil/${contatoSelecionado.id}`}
                      className={styles.btnPerfilHeader}
                    >
                      <User size={14} />
                      Ver Perfil
                    </Link>

                    <div className={styles.dropdownWrapper}>
                      <button
                        type="button"
                        className={styles.btnMenuHeader}
                        onClick={() => setMenuHeaderAberto(!menuHeaderAberto)}
                        title="Opções da conversa"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {menuHeaderAberto && (
                        <div className={styles.menuDropdown}>
                          <button
                            type="button"
                            className={styles.menuItemPerigo}
                            onClick={handleExcluirConversa}
                          >
                            <Trash2 size={14} />
                            Limpar histórico desta conversa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Histórico com Balões */}
                <div
                  className={styles.historicoMensagens}
                  onClick={() => {
                    setMenuAbertoId(null);
                    setMenuHeaderAberto(false);
                  }}
                >
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
                      const emEdicao = mensagemEmEdicaoId === msg.id;

                      return (
                        <div
                          key={msg.id}
                          className={`${styles.linhaMensagem} ${
                            souRemetente ? styles.enviada : styles.recebida
                          }`}
                        >
                          <div className={styles.balaoWrapper}>
                            {emEdicao ? (
                              <div className={styles.edicaoContainer}>
                                <input
                                  type="text"
                                  className={styles.inputEdicao}
                                  value={textoEdicao}
                                  onChange={(e) => setTextoEdicao(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      salvarEdicao(msg.id);
                                    } else if (e.key === 'Escape') {
                                      cancelarEdicao();
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className={styles.edicaoBotoes}>
                                  <button
                                    type="button"
                                    className={styles.btnSalvarEdicao}
                                    onClick={() => salvarEdicao(msg.id)}
                                  >
                                    Salvar
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.btnCancelarEdicao}
                                    onClick={cancelarEdicao}
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className={styles.balaoMensagem}>
                                  {msg.conteudo}
                                </div>

                                <div className={styles.mensagemAcoes}>
                                  <button
                                    type="button"
                                    className={styles.btnAcaoBalao}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuAbertoId(menuAbertoId === msg.id ? null : msg.id);
                                    }}
                                  >
                                    <MoreVertical size={13} />
                                  </button>

                                  {menuAbertoId === msg.id && (
                                    <div
                                      className={styles.menuMensagemDropdown}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {souRemetente && (
                                        <button
                                          type="button"
                                          onClick={() => iniciarEdicao(msg.id, msg.conteudo)}
                                        >
                                          <Pencil size={12} />
                                          Editar
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        className={styles.itemExcluir}
                                        onClick={() => handleExcluirMensagem(msg.id)}
                                      >
                                        <Trash2 size={12} />
                                        Apagar para mim
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <div className={styles.mensagemMeta}>
                            {msg.editada && (
                              <span className={styles.tagEditada} title="Editada">
                                (editada)
                              </span>
                            )}
                            <span>{formatarHora(msg.dataEnvio)}</span>
                            {souRemetente && (
                              <span
                                className={`${styles.iconeStatus} ${
                                  msg.lida ? styles.lida : ''
                                }`}
                                title={
                                  msg.lida && msg.dataLeitura
                                    ? `Lida às ${formatarHora(msg.dataLeitura)}`
                                    : msg.lida
                                    ? 'Lida'
                                    : 'Enviada'
                                }
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
