import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../../../components/Button/Button";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import styles from "./Login.module.css";

export const Login = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');
    const [isLoading, setIsLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        try {
            // Ping prévio para "acordar" o container no Render caso esteja em sleep (15 min inatividade)
            await fetch(`${backendUrl}/vagas`, { method: 'GET' }).catch(() => { });
        } finally {
            // Redireciona para o fluxo OAuth2 do Google após a API estar pronta
            window.location.href = `${backendUrl}/oauth2/authorization/google`;
        }
    };

    return (
        <AuthLayout
            imageSrc="https://www.netzpiloten.de/wp-content/uploads/2021/01/work-life-balance-home-office-1000x1000-1.jpg"
            imageAlt="Home Office Work-life balance"
        >
            <div className={styles.container}>
                <h2 className={styles.title}>Acesse sua conta</h2>

                {error && (
                    <div className={`${styles.feedback} ${styles.erro}`}>
                        Ocorreu um erro ao conectar com o Google. Tente novamente.
                    </div>
                )}

                <div className={styles.form}>
                    <Button
                        type="button"
                        onClick={handleGoogleAuth}
                        icon="fa-brands fa-google"
                        isLoading={isLoading}
                    >
                        Continuar com Google
                    </Button>

                    <p className={styles.cadastroHint}>
                        Ainda não tem conta?{' '}
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={handleGoogleAuth}
                            disabled={isLoading}
                        >
                            Cadastre-se com o Google
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};