import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Bell,
    Briefcase,
    GraduationCap,
    Users,
    MessageSquare,
    User,
    Info,
    Settings,
    LogOut,
    Search,
} from 'lucide-react';
import { useTopbar } from './useTopbar';
import { DICIONARIO, type Idioma } from '../../utils/i18n';
import styles from './Topbar.module.css';

interface TopbarProps {
    notificacoesNaoLidas?: number;
    mensagensNaoLidas?: number;
}

export const Topbar = ({ notificacoesNaoLidas, mensagensNaoLidas }: TopbarProps) => {
    const { usuario, isActive, handleLogout, totalMensagensNaoLidas, totalNotificacoesNaoLidas } = useTopbar();
    const location = useLocation();
    const navigate = useNavigate();

    const badgeMensagens = mensagensNaoLidas !== undefined ? mensagensNaoLidas : totalMensagensNaoLidas;
    const badgeNotificacoes = notificacoesNaoLidas !== undefined ? notificacoesNaoLidas : totalNotificacoesNaoLidas;

    const idiomaAtivo = ((usuario?.configuracoes?.idioma || localStorage.getItem('workonnection_idioma') || 'pt-BR') as Idioma);
    const t = DICIONARIO[idiomaAtivo] || DICIONARIO['pt-BR'];
    const isEstudante =
        usuario?.tipoUsuario?.toLowerCase() === 'estudante' ||
        usuario?.tipoUsuario?.toLowerCase() === 'aluno';
    const handleBuscar = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const termo = String(formData.get('busca') || '').trim();
        const searchParams = new URLSearchParams();
        if (termo) searchParams.set('busca', termo);

        navigate({
            pathname: '/home',
            search: searchParams.toString() ? `?${searchParams.toString()}` : '',
        });
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.logo}>
                <Link to="/home">
                    <img src="/logo_workonnection.png" alt="WorkConnection" />
                </Link>
            </div>

            <form
                key={location.search}
                className={styles.searchBar}
                role="search"
                onSubmit={handleBuscar}
            >
                <input
                    type="search"
                    name="busca"
                    placeholder={t.pesquisar}
                    aria-label={t.pesquisar}
                    defaultValue={new URLSearchParams(location.search).get('busca') || ''}
                />
                <button type="submit" aria-label={t.pesquisar} title={t.pesquisar}>
                    <Search size={16} />
                </button>
            </form>

            <nav className={styles.topIcons}>
                <Link to='/home' aria-label={t.home} title={t.home} className={`${styles.navLink} ${isActive('/home') ? styles.ativo : ''}`}>
                    <Home size={18} />
                    <span className={styles.iconText}>{t.home}</span>
                </Link>

                <Link to="/notificacoes" aria-label={t.avisos} title={t.avisos} className={`${styles.navLink} ${isActive('/notificacoes') ? styles.ativo : ''}`}>
                    <Bell size={18} />
                    {badgeNotificacoes > 0 && (
                        <span className={styles.notifBadge}>
                            {badgeNotificacoes > 99 ? '99+' : badgeNotificacoes}
                        </span>
                    )}
                    <span className={styles.iconText}>{t.avisos}</span>
                </Link>

                <Link to="/mensagens" aria-label={t.chat} title={t.chat} className={`${styles.navLink} ${isActive('/mensagens') ? styles.ativo : ''}`}>
                    <MessageSquare size={18} />
                    {badgeMensagens > 0 && (
                        <span className={styles.notifBadge}>
                            {badgeMensagens > 99 ? '99+' : badgeMensagens}
                        </span>
                    )}
                    <span className={styles.iconText}>{t.chat}</span>
                </Link>

                <Link to="/vagas" aria-label={isEstudante ? t.candidaturas : t.vagas} title={isEstudante ? t.candidaturas : t.vagas} className={`${styles.navLink} ${isActive('/vagas') ? styles.ativo : ''}`}>
                    {isEstudante ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                    <span className={styles.iconText}>{isEstudante ? t.candidaturas : t.vagas}</span>
                </Link>
                
                <Link to="/colaboradores" aria-label={t.rede} title={t.rede} className={`${styles.navLink} ${isActive('/colaboradores') ? styles.ativo : ''}`}>
                    <Users size={18} />
                    <span className={styles.iconText}>{t.rede}</span>
                </Link>

                <Link to="/perfil" aria-label={t.perfil} title={t.perfil} className={`${styles.navLink} ${isActive('/perfil') ? styles.ativo : ''}`}>
                    <User size={18} />
                    <span className={styles.iconText}>{t.perfil}</span>
                </Link>

                <Link to="/sobre" aria-label={t.sobre} title={t.sobre} className={`${styles.navLink} ${isActive('/sobre') ? styles.ativo : ''}`}>
                    <Info size={18} />
                    <span className={styles.iconText}>{t.sobre}</span>
                </Link>

                <Link to="/configuracoes" aria-label={t.opcoes} title={t.opcoes} className={`${styles.navLink} ${isActive('/configuracoes') ? styles.ativo : ''}`}>
                    <Settings size={18} />
                    <span className={styles.iconText}>{t.opcoes}</span>
                </Link>

                <button type="button" onClick={handleLogout} className={styles.navLink} title={t.sair} aria-label={t.sair}>
                    <LogOut size={18} />
                    <span className={styles.iconText}>{t.sair}</span>
                </button>
            </nav>
        </header>
    );
};