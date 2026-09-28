import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import { useAuth } from "../../../context/useAuth";
import { api } from "../../../services/api";
import styles from "./Login.module.css";

interface GoogleCredentialResponse {
    credential?: string;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
                    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
                    prompt: (notification?: unknown) => void;
                };
            };
        };
    }
}

export const Login = () => {
    const navigate = useNavigate();
    const { loginComGoogleToken, usuario } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const googleBtnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (usuario && usuario.cadastroCompleto) {
            navigate("/home", { replace: true });
        }
    }, [usuario, navigate]);

    useEffect(() => {
        let isMounted = true;

        const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
            console.log("Token do Google recebido com sucesso no cliente.");
            setIsLoading(true);
            setErrorMessage(null);

            try {
                if (!response?.credential) {
                    throw new Error("Credencial do Google não recebida.");
                }
                const user = await loginComGoogleToken(response.credential);
                if (user?.cadastroCompleto) {
                    navigate("/home", { replace: true });
                } else {
                    navigate("/cadastro", { replace: true });
                }
            } catch (err: unknown) {
                console.error("Erro na autenticação via token do Google:", err);
                const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
                const msg = errorObj?.response?.data?.message || errorObj?.message || "Ocorreu um erro ao conectar com o Google. Tente novamente.";
                setErrorMessage(msg);
            } finally {
                setIsLoading(false);
            }
        };

        const setupGoogle = (resolvedClientId: string) => {
            if (!isMounted) return;

            const initGoogleSignIn = () => {
                if (window.google?.accounts?.id && googleBtnRef.current) {
                    window.google.accounts.id.initialize({
                        client_id: resolvedClientId,
                        callback: handleCredentialResponse,
                    });

                    window.google.accounts.id.renderButton(googleBtnRef.current, {
                        theme: "outline",
                        size: "large",
                        type: "standard",
                        text: "continue_with",
                        shape: "rectangular",
                        logo_alignment: "left",
                        width: 320,
                    });

                    window.google.accounts.id.prompt();
                }
            };

            if (window.google?.accounts?.id) {
                initGoogleSignIn();
            } else {
                const interval = setInterval(() => {
                    if (window.google?.accounts?.id) {
                        clearInterval(interval);
                        initGoogleSignIn();
                    }
                }, 300);

                return () => clearInterval(interval);
            }
        };

        const resolveAndInit = async () => {
            const envClientId =
                import.meta.env.VITE_GOOGLE_CLIENT_ID ||
                import.meta.env.GOOGLE_CLIENT_ID;

            if (envClientId) {
                setupGoogle(envClientId);
                return;
            }

            try {
                const response = await api.get<{ clientId: string }>('/auth/google/client-id');
                if (response.data?.clientId) {
                    setupGoogle(response.data.clientId);
                    return;
                }
            } catch (err) {
                console.warn("Não foi possível obter clientId da API:", err);
            }

            if (isMounted) {
                setErrorMessage("Configuração do Google Client ID não encontrada no .env ou no servidor.");
            }
        };

        resolveAndInit();

        return () => {
            isMounted = false;
        };
    }, [loginComGoogleToken, navigate]);

    return (
        <AuthLayout
            imageSrc="https://www.netzpiloten.de/wp-content/uploads/2021/01/work-life-balance-home-office-1000x1000-1.jpg"
            imageAlt="Home Office Work-life balance"
        >
            <div className={styles.container}>
                <h2 className={styles.title}>Acesse sua conta</h2>
                <p className={styles.subtitle}>
                    Conecte-se com sua conta Google para acessar as melhores oportunidades.
                </p>

                {errorMessage && (
                    <div className={`${styles.feedback} ${styles.erro}`}>
                        {errorMessage}
                    </div>
                )}

                {isLoading && (
                    <div className={`${styles.feedback} ${styles.sucesso}`}>
                        Autenticando sua conta, aguarde...
                    </div>
                )}

                <div className={styles.form}>
                    <div className={styles.googleBtnWrapper} ref={googleBtnRef}></div>

                    <p className={styles.cadastroHint}>
                        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};