import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Globe,
  Users,
  UserPlus,
  Trash2,
  Check,
  AlertTriangle,
  LogOut,
  Palette,
  ShieldAlert,
} from 'lucide-react';
import { Topbar } from '../../components/Topbar/Topbar';
import { useAuth } from '../../context/useAuth';
import { DICIONARIO, type Idioma } from '../../utils/i18n';
import { contasManager, type ContaSalva } from '../../utils/contasManager';
import styles from './Configuracoes.module.css';

export const Configuracoes: React.FC = () => {
  const { usuario, atualizarConfiguracoes, logout, excluirConta } = useAuth();
  const navigate = useNavigate();

  // Estados locais
  const temaAtual = usuario?.configuracoes?.tema || localStorage.getItem('workonnection_tema') || 'claro';
  const idiomaAtual = (usuario?.configuracoes?.idioma || localStorage.getItem('workonnection_idioma') || 'pt-BR') as Idioma;

  const [tema, setTema] = useState<string>(temaAtual);
  const [idioma, setIdioma] = useState<Idioma>(idiomaAtual);
  const [contas, setContas] = useState<ContaSalva[]>(() => contasManager.obterContas());
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const t = DICIONARIO[idioma] || DICIONARIO['pt-BR'];

  // Alterar tema
  const handleTrocarTema = async (novoTema: string) => {
    setTema(novoTema);
    if (novoTema === 'escuro') {
      document.documentElement.setAttribute('data-tema', 'escuro');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-tema', 'claro');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('workonnection_tema', novoTema);
    await atualizarConfiguracoes({ tema: novoTema });
  };

  // Alterar idioma
  const handleTrocarIdioma = async (novoIdioma: Idioma) => {
    setIdioma(novoIdioma);
    document.documentElement.setAttribute('lang', novoIdioma);
    localStorage.setItem('workonnection_idioma', novoIdioma);
    await atualizarConfiguracoes({ idioma: novoIdioma });
  };

  // Trocar conta rápida
  const handleTrocarConta = async (conta: ContaSalva) => {
    if (conta.id === usuario?.id) return;

    await logout();

    // Se temos um token guardado da sessão anterior da conta
    if (conta.token) {
      localStorage.setItem('authToken', conta.token);
      localStorage.setItem('usuarioId', conta.id);
    }

    // Redireciona para o login com indicação do email preenchido para facilidade
    navigate('/login', { state: { emailPredefinido: conta.email } });
  };

  // Adicionar outra conta (desloga e vai para login)
  const handleAdicionarConta = async () => {
    await logout();
    navigate('/login');
  };

  // Remover conta da lista do navegador
  const handleRemoverConta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    contasManager.removerConta(id);
    setContas(contasManager.obterContas());
  };

  // Sair do site
  const handleSairSite = async () => {
    await logout();
    navigate('/login');
  };

  // Excluir conta permanentemente
  const handleConfirmarExcluirConta = async () => {
    try {
      setExcluindo(true);
      if (usuario?.id) {
        contasManager.removerConta(usuario.id);
      }
      await excluirConta();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Não foi possível excluir a conta. Tente novamente.');
    } finally {
      setExcluindo(false);
      setModalExclusaoAberto(false);
    }
  };

  return (
    <div>
      <Topbar />

      <main className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>{t.tituloConfiguracoes}</h1>
          <p className={styles.subtitulo}>{t.subtituloConfiguracoes}</p>
        </div>

        {/* 1. SEÇÃO DE APARÊNCIA E TEMA */}
        <section className={styles.cardSecao}>
          <div className={styles.secaoHeader}>
            <Palette size={22} />
            <h3 className={styles.secaoTitulo}>{t.secaoAparencia}</h3>
          </div>
          <p className={styles.secaoDescricao}>{t.descAparencia}</p>

          <div className={styles.gridOpcoes}>
            <button
              type="button"
              className={`${styles.opcaoCard} ${tema === 'claro' ? styles.opcaoCardAtiva : ''}`}
              onClick={() => handleTrocarTema('claro')}
            >
              <div className={styles.opcaoIcone}>
                <Sun size={20} />
              </div>
              <div className={styles.opcaoInfo}>
                <div className={styles.opcaoTitulo}>{t.temaClaro}</div>
                <div className={styles.opcaoSubtitulo}>{t.temaDescClaro}</div>
              </div>
              {tema === 'claro' && (
                <div className={styles.checkBadge}>
                  <Check size={18} />
                </div>
              )}
            </button>

            <button
              type="button"
              className={`${styles.opcaoCard} ${tema === 'escuro' ? styles.opcaoCardAtiva : ''}`}
              onClick={() => handleTrocarTema('escuro')}
            >
              <div className={styles.opcaoIcone}>
                <Moon size={20} />
              </div>
              <div className={styles.opcaoInfo}>
                <div className={styles.opcaoTitulo}>{t.temaEscuro}</div>
                <div className={styles.opcaoSubtitulo}>{t.temaDescEscuro}</div>
              </div>
              {tema === 'escuro' && (
                <div className={styles.checkBadge}>
                  <Check size={18} />
                </div>
              )}
            </button>
          </div>
        </section>

        {/* 2. SEÇÃO DE IDIOMA */}
        <section className={styles.cardSecao}>
          <div className={styles.secaoHeader}>
            <Globe size={22} />
            <h3 className={styles.secaoTitulo}>{t.secaoIdioma}</h3>
          </div>
          <p className={styles.secaoDescricao}>{t.descIdioma}</p>

          <div className={styles.gridOpcoes}>
            {[
              { codigo: 'pt-BR' as Idioma, label: t.portugues, sub: 'Brasil / Português' },
              { codigo: 'en' as Idioma, label: t.ingles, sub: 'United States / English' },
              { codigo: 'es' as Idioma, label: t.espanhol, sub: 'España / Latinoamérica' },
            ].map((lang) => (
              <button
                key={lang.codigo}
                type="button"
                className={`${styles.opcaoCard} ${idioma === lang.codigo ? styles.opcaoCardAtiva : ''}`}
                onClick={() => handleTrocarIdioma(lang.codigo)}
              >
                <div className={styles.opcaoIcone}>
                  <Globe size={20} />
                </div>
                <div className={styles.opcaoInfo}>
                  <div className={styles.opcaoTitulo}>{lang.label}</div>
                  <div className={styles.opcaoSubtitulo}>{lang.sub}</div>
                </div>
                {idioma === lang.codigo && (
                  <div className={styles.checkBadge}>
                    <Check size={18} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 3. SEÇÃO DE CONTAS SALVAS NESTE NAVEGADOR */}
        <section className={styles.cardSecao}>
          <div className={styles.secaoHeader}>
            <Users size={22} />
            <h3 className={styles.secaoTitulo}>{t.secaoContas}</h3>
          </div>
          <p className={styles.secaoDescricao}>{t.descContas}</p>

          <div className={styles.listaContas}>
            {contas.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                {t.nenhumaOutraConta}
              </p>
            ) : (
              contas.map((c) => {
                const emUso = c.id === usuario?.id;
                return (
                  <div
                    key={c.id}
                    className={`${styles.contaItem} ${emUso ? styles.contaItemAtiva : ''}`}
                  >
                    <div className={styles.contaPerfil}>
                      <img
                        src={c.foto}
                        alt={c.nome}
                        className={styles.contaAvatar}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            c.nome
                          )}&background=007B8A&color=fff`;
                        }}
                      />
                      <div className={styles.contaDados}>
                        <div className={styles.contaNomeRow}>
                          <span className={styles.contaNome}>{c.nome}</span>
                          <span className={styles.contaBadgeTipo}>
                            {c.tipoUsuario}
                          </span>
                        </div>
                        <span className={styles.contaEmail}>{c.email}</span>
                      </div>
                    </div>

                    <div className={styles.contaAcoes}>
                      {emUso ? (
                        <span className={styles.badgeLogado}>
                          <Check size={14} />
                          {t.contaAtual}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={styles.btnTrocarConta}
                          onClick={() => handleTrocarConta(c)}
                        >
                          <LogOut size={13} />
                          {t.entrarConta}
                        </button>
                      )}

                      {!emUso && (
                        <button
                          type="button"
                          className={styles.btnRemoverConta}
                          title={t.removerContaNavegador}
                          onClick={(e) => handleRemoverConta(c.id, e)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            className={styles.btnAdicionarConta}
            onClick={handleAdicionarConta}
          >
            <UserPlus size={16} />
            <span>{t.adicionarConta}</span>
          </button>
        </section>

        {/* 4. SEÇÃO DE ZONA DE PERIGO (EXCLUIR CONTA / SAIR) */}
        <section className={`${styles.cardSecao} ${styles.cardPerigo}`}>
          <div className={`${styles.secaoHeader} ${styles.headerPerigo}`}>
            <ShieldAlert size={22} />
            <h3 className={styles.secaoTitulo}>{t.secaoZonaPerigo}</h3>
          </div>
          <p className={styles.secaoDescricao}>{t.descZonaPerigo}</p>

          <div className={styles.perigoContainer}>
            <div className={styles.perigoConteudo}>
              <div className={styles.perigoTexto}>
                <h5>{t.sairSiteBtn}</h5>
                <p>{t.sairSiteDesc}</p>
              </div>

              <button
                type="button"
                className={styles.btnSairConta}
                onClick={handleSairSite}
              >
                <LogOut size={16} />
                <span>{t.sairSiteBtn}</span>
              </button>
            </div>

            <div className={styles.perigoConteudo}>
              <div className={styles.perigoTexto}>
                <h5>{t.excluirContaBtn}</h5>
                <p>{t.excluirContaDesc}</p>
              </div>

              <button
                type="button"
                className={styles.btnExcluir}
                onClick={() => setModalExclusaoAberto(true)}
              >
                <Trash2 size={16} />
                <span>{t.excluirContaBtn}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {modalExclusaoAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalIcone}>
              <AlertTriangle size={28} />
            </div>

            <h3>{t.excluirContaBtn}</h3>
            <p>{t.confirmarExclusao}</p>

            <div className={styles.modalAcoes}>
              <button
                type="button"
                className={styles.btnCancelar}
                disabled={excluindo}
                onClick={() => setModalExclusaoAberto(false)}
              >
                {t.cancelar}
              </button>

              <button
                type="button"
                className={styles.btnConfirmarExcluir}
                disabled={excluindo}
                onClick={handleConfirmarExcluirConta}
              >
                {excluindo ? t.excluindo : t.excluirContaBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Configuracoes;
