import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Topbar.module.css';

interface TopbarProps {
    notificacoesNaoLidas?: number;
}

export const Topbar = ({ notificacoesNaoLidas = 0 }: TopbarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        try {
            if (logout) {
                await logout();
            }
            navigate('/login');
        } catch (error) {
            console.error("Erro ao realizar logout", error);
        }
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.logo}>
                <Link to="/home">
                    <img src="/imagens/logo_workonnection.png" alt="WorkConnection" />
                </Link>
            </div>

            <div className={styles.searchBar}>
                <input type="text" placeholder='Pesquisar...' />
            </div>

            <nav className={styles.topIcons}>
                <Link to='/vagas' className={`${styles.navLink} ${isActive('/home') ? styles.ativo : ''}`}>
                    <i className='fas fa-home'></i>
                    <span className={styles.iconText}>Home</span>
                </Link>

                <Link to="/notificacoes" className={`${styles.navLink} ${isActive('/notificacoes') ? styles.ativo : ''}`}>
                    <i className="fas fa-bell"></i>
                    {notificacoesNaoLidas > 0 && (
                        <span className={styles.notifBadge}>
                            {notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}
                        </span>
                    )}
                    <span className={styles.iconText}>Avisos</span>
                </Link>

                <Link to="/vagas-gerenciar" className={`${styles.navLink} ${isActive('/vagas-gerenciar') ? styles.ativo : ''}`}>
                    <i className="fas fa-briefcase"></i>
                    <span className={styles.iconText}>Vagas</span>
                </Link>
                
                <Link to="/colaboradores" className={`${styles.navLink} ${isActive('/colaboradores') ? styles.ativo : ''}`}>
                    <i className="fas fa-users"></i>
                    <span className={styles.iconText}>Rede</span>
                </Link>

                <Link to="/perfil" className={`${styles.navLink} ${isActive('/perfil') ? styles.ativo : ''}`}>
                    <i className="fas fa-user"></i>
                    <span className={styles.iconText}>Perfil</span>
                </Link>

                <Link to="/sobre" className={`${styles.navLink} ${isActive('/sobre') ? styles.ativo : ''}`}>
                    <i className="fas fa-info-circle"></i>
                    <span className={styles.iconText}>Sobre</span>
                </Link>

                <Link to="/configuracoes" className={`${styles.navLink} ${isActive('/configuracoes') ? styles.ativo : ''}`}>
                    <i className="fas fa-cog"></i>
                    <span className={styles.iconText}>Opções</span>
                </Link>

                <button type="button" onClick={handleLogout} className={styles.navLink} title="Sair">
                    <i className="fas fa-sign-out-alt"></i>
                    <span className={styles.iconText}>Sair</span>
                </button>
            </nav>
        </header>
    );
};
