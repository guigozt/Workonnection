import { useLocation } from "react-router-dom";
import { Button } from "../../../components/Button/Button";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import styles from "./Login.module.css";

export const Login = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const handleGoogleAuth = () => {
        // Redireciona o usuário para a tela de escolha de email do Google
        window.location.href = `${backendUrl}/oauth2/authorization/google`;
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
                    >
                        Continuar com Google
                    </Button>

                    <p className={styles.cadastroHint}>
                        Ainda não tem conta?{' '}
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={handleGoogleAuth} // Usa o exato mesmo fluxo
                        >
                            Cadastre-se com o Google
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};
