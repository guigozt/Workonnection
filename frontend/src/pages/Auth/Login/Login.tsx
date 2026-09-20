import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../components/Button/Button";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import styles from "./Login.module.css";

export const Login = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    return (
        <AuthLayout
            imageSrc="https://www.netzpiloten.de/wp-content/uploads/2021/01/work-life-balance-home-office-1000x1000-1.jpg"
            imageAlt="Home Office Work-life balance"
        >
            {error && (
                <div className={`${styles.feedback} ${styles.erro}`}>
                    Ocorreu um erro ao logar com o Google. Tente novamente.
                </div>
            )}

            <div className={styles.form}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-color)" }}>Bem-vindo de volta!</h2>
                <Button
                    type="button"
                    onClick={() => { window.location.href = `${backendUrl}/oauth2/authorization/google`; }}
                    icon="fa-brands fa-google"
                >
                    Continuar com Google
                </Button>

                <p className={styles.cadastro}>
                    Não é cadastrado? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </div>
        </AuthLayout>
    );
};
