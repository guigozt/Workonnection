import React, { useContext, useState} from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom";
import { InputGroup } from "../../components/Input/InputGroup";
import { Button } from "../../components/Button/Button";
import styles from "./Login.module.css";

export const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'erro' | 'sucesso' | ''}>({
        message: '',
        type: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setFeedback({ message: '', type: ''});

        const localErrors: { email?: string; senha?: string } = {};
        let isValido = true;

        if (!email.trim()) {
            localErrors.email = "Email obrigatório";
            isValido = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            localErrors.email = "Email inválido";
            isValido = false;
        }

        if (!senha) {
            localErrors.senha = "Senha obrigatória"
            isValido = false;
        }

        if (!isValido) {
            setErrors (localErrors);
            setFeedback({ message: "Preencha os campos corretamente.", type: "erro" });
            setIsSubmitting(false);
            return;
        }

        try {
            await login({ email, senha });

            setFeedback({ message: "Login realizado com sucesso!", type: "sucesso" });

            setTimeout(() => {
                navigate('/vagas'); //A pagina vai ser Home.tsx
            }, 1200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrorMessage = error.response?.data?.erro || "Email ou senha inválidos.";
            setFeedback({ message: apiErrorMessage, type: "erro" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.left}>
                <img 
                    src="https://www.netzpiloten.de/wp-content/uploads/2021/01/work-life-balance-home-office-1000x1000-1.jpg" 
                    alt="Home Office Work-life balance" 
                />
            </div>

            <div className={styles.right}>
                <div className={styles.loginFormBox}>
                    <img src="/imagens/logo_workonnection.png" className={styles.logoLogin} alt="Logo Workonnection" />

                    {feedback.message && (
                        <div className={`${styles.feedback} ${feedback.type === 'erro' ? styles.erro : styles.sucesso}`}>
                            {feedback.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <InputGroup
                            type="email"
                            placeholder="Digite seu E-mail"
                            autoComplete="email"
                            icon="fa-solid fa-envelope"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            errorMessage={errors.email}
                        />

                        <InputGroup 
                            type="password"
                            placeholder="Digite sua Senha"
                            autoComplete="current-password"
                            icon="fa-solid fa-lock"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            errorMessage={errors.senha}
                        />

                        <Button type="submit" icon="fa-solid fa-arrow-right-to-bracket" isLoading={isSubmitting}>
                            Entrar
                        </Button>

                        <p className={styles.cadastro}>
                            Não é cadastrado? 
                            <Link to="/cadastro">Cadastre-se</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}