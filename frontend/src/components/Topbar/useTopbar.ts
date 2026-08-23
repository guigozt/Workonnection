import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const useTopbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Erro ao realizar logout no servidor:", error);
        } finally {
            navigate('/login');
        }
    };

    return {
        isActive,
        handleLogout
    };
};