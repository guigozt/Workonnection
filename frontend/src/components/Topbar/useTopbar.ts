import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { chatService } from '../../services/chatService';
import { getPusherClient } from '../../services/pusher';

export const useTopbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { usuario, logout } = useAuth();
    const [totalMensagensNaoLidas, setTotalMensagensNaoLidas] = useState(0);

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        if (!usuario?.id) return;

        let isMounted = true;
        const carregarTotal = async () => {
            const total = await chatService.obterTotalNaoLidas();
            if (isMounted) {
                setTotalMensagensNaoLidas(total);
            }
        };

        carregarTotal();

        // Conexão em tempo real via Pusher
        const pusher = getPusherClient();
        const canalNome = `chat-${usuario.id}`;
        const canal = pusher.subscribe(canalNome);

        const onAtualizarContador = () => {
            carregarTotal();
        };

        canal.bind('nova-mensagem', onAtualizarContador);
        canal.bind('mensagens-lidas', onAtualizarContador);
        canal.bind('mensagem-excluida', onAtualizarContador);
        canal.bind('conversa-excluida', onAtualizarContador);

        // Heartbeat de backup
        const interval = setInterval(carregarTotal, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
            canal.unbind('nova-mensagem', onAtualizarContador);
            canal.unbind('mensagens-lidas', onAtualizarContador);
            canal.unbind('mensagem-excluida', onAtualizarContador);
            canal.unbind('conversa-excluida', onAtualizarContador);
            pusher.unsubscribe(canalNome);
        };
    }, [usuario?.id]);

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
        handleLogout,
        totalMensagensNaoLidas,
    };
};