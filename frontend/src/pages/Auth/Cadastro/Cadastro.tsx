import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../components/Button/Button";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import styles from "./Cadastro.module.css";

export const Cadastro = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    return (
        <AuthLayout
            imageSrc="https://st3.depositphotos.com/3591429/18972/i/450/depositphotos_189724132-stock-photo-young-man-working-with-his.jpg"
            imageAlt="Jovem trabalhando em casa com laptop"
        >
            {error && (
                <div className={`${styles.feedback} ${styles.erro}`}>
                    Ocorreu um erro no cadastro. Tente novamente.
                </div>
            )}

            <div className={styles.form}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-color)" }}>Crie sua Conta</h2>
                <p style={{ textAlign: "center", marginBottom: "30px", color: "var(--text-color-secondary)" }}>
                    Inicie seu cadastro conectando com o Google. É rápido e seguro!
                </p>
                <Button
                    type="button"
                    onClick={() => { window.location.href = `${backendUrl}/oauth2/authorization/google`; }}
                    icon="fa-brands fa-google"
                >
                    Cadastrar com Google
                </Button>

                <p className={styles.login}>
                    Já é cadastrado? <Link to="/login">Faça Login</Link>
                </p>
            </div>
        </AuthLayout>
    );
};
