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
    LogOut 
} from 'lucide-react';
import { useTopbar } from './useTopbar';
import styles from './Topbar.module.css';

interface TopbarProps {
    notificacoesNaoLidas?: number;
    mensagensNaoLidas?: number;
}

export const Topbar = ({ notificacoesNaoLidas, mensagensNaoLidas }: TopbarProps) => {
    // Importando a lógica do nosso custom hook
    const { isActive, handleLogout, totalMensagensNaoLidas, totalNotificacoesNaoLidas } = useTopbar();

    const badgeMensagens = mensagensNaoLidas !== undefined ? mensagensNaoLidas : totalMensagensNaoLidas;
    const badgeNotificacoes = notificacoesNaoLidas !== undefined ? notificacoesNaoLidas : totalNotificacoesNaoLidas;

    return (
        <header className={styles.topbar}>
            <div className={styles.logo}>
                <Link to="/home">
                    <img src="/logo_workonnection.png" alt="WorkConnection" />
                </Link>
            </div>

            <div className={styles.searchBar}>
                <input type="text" placeholder='Pesquisar...' />
            </div>

            <nav className={styles.topIcons}>
                <Link to='/home' className={`${styles.navLink} ${isActive('/home') ? styles.ativo : ''}`}>
                    <Home size={18} />
                    <span className={styles.iconText}>Home</span>
                </Link>

                <Link to="/notificacoes" className={`${styles.navLink} ${isActive('/notificacoes') ? styles.ativo : ''}`}>
                    <Bell size={18} />
                    {badgeNotificacoes > 0 && (
                        <span className={styles.notifBadge}>
                            {badgeNotificacoes > 99 ? '99+' : badgeNotificacoes}
                        </span>
                    )}
                    <span className={styles.iconText}>Avisos</span>
                </Link>

                <Link to="/mensagens" className={`${styles.navLink} ${isActive('/mensagens') ? styles.ativo : ''}`}>
                    <MessageSquare size={18} />
                    {badgeMensagens > 0 && (
                        <span className={styles.notifBadge}>
                            {badgeMensagens > 99 ? '99+' : badgeMensagens}
                        </span>
                    )}
                    <span className={styles.iconText}>Chat</span>
                </Link>

                <Link to="/vagas" className={`${styles.navLink} ${isActive('/vagas') ? styles.ativo : ''}`}>
                    <Briefcase size={18} />
                    <span className={styles.iconText}>Vagas</span>
                </Link>
                
                <Link to="/colaboradores" className={`${styles.navLink} ${isActive('/colaboradores') ? styles.ativo : ''}`}>
                    <Users size={18} />
                    <span className={styles.iconText}>Rede</span>
                </Link>

                <Link to="/perfil" className={`${styles.navLink} ${isActive('/perfil') ? styles.ativo : ''}`}>
                    <User size={18} />
                    <span className={styles.iconText}>Perfil</span>
                </Link>

                <Link to="/sobre" className={`${styles.navLink} ${isActive('/sobre') ? styles.ativo : ''}`}>
                    <Info size={18} />
                    <span className={styles.iconText}>Sobre</span>
                </Link>

                <Link to="/configuracoes" className={`${styles.navLink} ${isActive('/configuracoes') ? styles.ativo : ''}`}>
                    <Settings size={18} />
                    <span className={styles.iconText}>Opções</span>
                </Link>

                <button type="button" onClick={handleLogout} className={styles.navLink} title="Sair">
                    <LogOut size={18} />
                    <span className={styles.iconText}>Sair</span>
                </button>
            </nav>
        </header>
    );
};