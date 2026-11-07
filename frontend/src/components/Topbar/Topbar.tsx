import { Link } from 'react-router-dom';
import { 
    Home, 
    Bell, 
    Briefcase, 
    Users, 
    MessageSquare,
    User, 
    Info, 
    Settings, 
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { useTopbar } from './useTopbar';
import { DICIONARIO, type Idioma } from '../../utils/i18n';
import styles from './Topbar.module.css';

interface TopbarProps {
    notificacoesNaoLidas?: number;
    mensagensNaoLidas?: number;
}

export const Topbar = ({ notificacoesNaoLidas, mensagensNaoLidas }: TopbarProps) => {
    const { 
        usuario, 
        isActive, 
        handleLogout, 
        totalMensagensNaoLidas, 
        totalNotificacoesNaoLidas,
        menuAberto,
        toggleMenu,
        fecharMenu,
        fotoPerfilUrl,
        iniciaisUsuario,
    } = useTopbar();

    const badgeMensagens = mensagensNaoLidas !== undefined ? mensagensNaoLidas : totalMensagensNaoLidas;
    const badgeNotificacoes = notificacoesNaoLidas !== undefined ? notificacoesNaoLidas : totalNotificacoesNaoLidas;

    const idiomaAtivo = ((usuario?.configuracoes?.idioma || localStorage.getItem('workonnection_idioma') || 'pt-BR') as Idioma);
    const t = DICIONARIO[idiomaAtivo] || DICIONARIO['pt-BR'];

    return (
        <header className={styles.topbar}>
            <div className={styles.topbarInner}>
                <div className={styles.logoWrapper}>
                    <Link to="/home" className={styles.logoLink} title="Workonnection Home">
                        <img 
                            src="/logo_workonnection_cropped.png" 
                            alt="Workonnection" 
                            className={styles.logoImg} 
                        />
                    </Link>
                </div>

                {/* Navegação Desktop */}
                <nav className={styles.desktopNav} aria-label="Navegação principal">
                    <Link 
                        to="/home" 
                        className={`${styles.navItem} ${isActive('/home') ? styles.ativo : ''}`}
                    >
                        <Home size={19} />
                        <span className={styles.navLabel}>{t.home}</span>
                    </Link>

                    <Link 
                        to="/vagas" 
                        className={`${styles.navItem} ${isActive('/vagas') ? styles.ativo : ''}`}
                    >
                        <Briefcase size={19} />
                        <span className={styles.navLabel}>{t.vagas}</span>
                    </Link>

                    <Link 
                        to="/colaboradores" 
                        className={`${styles.navItem} ${isActive('/colaboradores') ? styles.ativo : ''}`}
                    >
                        <Users size={19} />
                        <span className={styles.navLabel}>{t.rede}</span>
                    </Link>

                    <Link 
                        to="/mensagens" 
                        className={`${styles.navItem} ${isActive('/mensagens') ? styles.ativo : ''}`}
                    >
                        <div className={styles.iconWithBadge}>
                            <MessageSquare size={19} />
                            {badgeMensagens > 0 && (
                                <span className={styles.badge}>
                                    {badgeMensagens > 99 ? '99+' : badgeMensagens}
                                </span>
                            )}
                        </div>
                        <span className={styles.navLabel}>{t.chat}</span>
                    </Link>

                    <Link 
                        to="/notificacoes" 
                        className={`${styles.navItem} ${isActive('/notificacoes') ? styles.ativo : ''}`}
                    >
                        <div className={styles.iconWithBadge}>
                            <Bell size={19} />
                            {badgeNotificacoes > 0 && (
                                <span className={styles.badge}>
                                    {badgeNotificacoes > 99 ? '99+' : badgeNotificacoes}
                                </span>
                            )}
                        </div>
                        <span className={styles.navLabel}>{t.avisos}</span>
                    </Link>

                    <Link 
                        to="/sobre" 
                        className={`${styles.navItem} ${isActive('/sobre') ? styles.ativo : ''}`}
                    >
                        <Info size={19} />
                        <span className={styles.navLabel}>{t.sobre}</span>
                    </Link>

                    <div className={styles.navDivider} aria-hidden="true" />

                    <Link 
                        to="/perfil" 
                        className={`${styles.navItem} ${styles.perfilItem} ${isActive('/perfil') ? styles.ativo : ''}`}
                        title={t.perfil}
                    >
                        {fotoPerfilUrl ? (
                            <img 
                                src={fotoPerfilUrl} 
                                alt={usuario?.nome || 'Perfil'} 
                                className={styles.userAvatarSmall} 
                            />
                        ) : (
                            <User size={19} />
                        )}
                        <span className={styles.navLabel}>{t.perfil}</span>
                    </Link>

                    <Link 
                        to="/configuracoes" 
                        className={`${styles.navItem} ${isActive('/configuracoes') ? styles.ativo : ''}`} 
                        title={t.opcoes}
                    >
                        <Settings size={19} />
                        <span className={styles.navLabel}>{t.opcoes}</span>
                    </Link>

                    <button 
                        type="button" 
                        onClick={handleLogout} 
                        className={`${styles.navItem} ${styles.logoutItem}`} 
                        title={t.sair}
                        aria-label={t.sair}
                    >
                        <LogOut size={19} />
                        <span className={styles.navLabel}>{t.sair}</span>
                    </button>
                </nav>

                {/* Ações Mobile (Avisos, Chat com Badges e Botão Toggle) */}
                <div className={styles.mobileActions}>
                    <Link 
                        to="/notificacoes" 
                        className={styles.mobileActionBtn} 
                        title={t.avisos} 
                        aria-label={t.avisos}
                    >
                        <Bell size={20} />
                        {badgeNotificacoes > 0 && (
                            <span className={styles.mobileBadge}>
                                {badgeNotificacoes > 99 ? '99+' : badgeNotificacoes}
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/mensagens" 
                        className={styles.mobileActionBtn} 
                        title={t.chat} 
                        aria-label={t.chat}
                    >
                        <MessageSquare size={20} />
                        {badgeMensagens > 0 && (
                            <span className={styles.mobileBadge}>
                                {badgeMensagens > 99 ? '99+' : badgeMensagens}
                            </span>
                        )}
                    </Link>

                    <button
                        type="button"
                        className={styles.menuToggleBtn}
                        onClick={toggleMenu}
                        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                        aria-expanded={menuAberto}
                    >
                        {menuAberto ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Menu Drawer Mobile */}
            {menuAberto && (
                <>
                    <div 
                        className={styles.mobileBackdrop} 
                        onClick={fecharMenu} 
                        aria-hidden="true" 
                    />
                    <aside className={styles.mobileDrawer} aria-label="Menu de Navegação">
                        <div className={styles.drawerHeader}>
                            <Link to="/perfil" className={styles.drawerUserInfo} onClick={fecharMenu}>
                                {fotoPerfilUrl ? (
                                    <img 
                                        src={fotoPerfilUrl} 
                                        alt={usuario?.nome || 'Perfil'} 
                                        className={styles.drawerAvatar} 
                                    />
                                ) : (
                                    <div className={styles.drawerAvatarInitial}>
                                        {iniciaisUsuario}
                                    </div>
                                )}
                                <div className={styles.drawerUserDetails}>
                                    <span className={styles.drawerUserName}>
                                        {usuario?.nome || 'Usuário'}
                                    </span>
                                    <span className={styles.drawerUserEmail}>
                                        {usuario?.email || ''}
                                    </span>
                                </div>
                            </Link>

                            <button 
                                type="button" 
                                className={styles.drawerCloseBtn} 
                                onClick={fecharMenu}
                                aria-label="Fechar menu"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.drawerNavList}>
                            <Link 
                                to="/home" 
                                className={`${styles.drawerNavItem} ${isActive('/home') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <Home size={20} />
                                    <span>{t.home}</span>
                                </div>
                                <ChevronRight size={18} className={styles.drawerChevron} />
                            </Link>

                            <Link 
                                to="/vagas" 
                                className={`${styles.drawerNavItem} ${isActive('/vagas') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <Briefcase size={20} />
                                    <span>{t.vagas}</span>
                                </div>
                                <ChevronRight size={18} className={styles.drawerChevron} />
                            </Link>

                            <Link 
                                to="/colaboradores" 
                                className={`${styles.drawerNavItem} ${isActive('/colaboradores') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <Users size={20} />
                                    <span>{t.rede}</span>
                                </div>
                                <ChevronRight size={18} className={styles.drawerChevron} />
                            </Link>

                            <Link 
                                to="/mensagens" 
                                className={`${styles.drawerNavItem} ${isActive('/mensagens') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <MessageSquare size={20} />
                                    <span>{t.chat}</span>
                                </div>
                                {badgeMensagens > 0 ? (
                                    <span className={styles.drawerBadge}>
                                        {badgeMensagens > 99 ? '99+' : badgeMensagens}
                                    </span>
                                ) : (
                                    <ChevronRight size={18} className={styles.drawerChevron} />
                                )}
                            </Link>

                            <Link 
                                to="/notificacoes" 
                                className={`${styles.drawerNavItem} ${isActive('/notificacoes') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <Bell size={20} />
                                    <span>{t.avisos}</span>
                                </div>
                                {badgeNotificacoes > 0 ? (
                                    <span className={styles.drawerBadge}>
                                        {badgeNotificacoes > 99 ? '99+' : badgeNotificacoes}
                                    </span>
                                ) : (
                                    <ChevronRight size={18} className={styles.drawerChevron} />
                                )}
                            </Link>

                            <Link 
                                to="/perfil" 
                                className={`${styles.drawerNavItem} ${isActive('/perfil') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <User size={20} />
                                    <span>{t.perfil}</span>
                                </div>
                                <ChevronRight size={18} className={styles.drawerChevron} />
                            </Link>

                            <Link 
                                to="/sobre" 
                                className={`${styles.drawerNavItem} ${isActive('/sobre') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <Info size={20} />
                                    <span>{t.sobre}</span>
                                </div>
                                <ChevronRight size={18} className={styles.drawerChevron} />
                            </Link>

                            <Link 
                                to="/configuracoes" 
                                className={`${styles.drawerNavItem} ${isActive('/configuracoes') ? styles.ativo : ''}`}
                                onClick={fecharMenu}
                            >
                                <div className={styles.drawerNavContent}>
                                    <Settings size={20} />
                                    <span>{t.opcoes}</span>
                                </div>
                                <ChevronRight size={18} className={styles.drawerChevron} />
                            </Link>
                        </div>

                        <div className={styles.drawerFooter}>
                            <button 
                                type="button" 
                                className={styles.drawerLogoutBtn}
                                onClick={() => {
                                    fecharMenu();
                                    handleLogout();
                                }}
                            >
                                <LogOut size={18} />
                                <span>{t.sair}</span>
                            </button>
                        </div>
                    </aside>
                </>
            )}
        </header>
    );
};
