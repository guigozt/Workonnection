import React, { useContext, useState} from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom";
import { InputGroup } from "../../components/Input/InputGroup";
import { Button } from "../../components/Button/Button";
import { AuthLayout } from "../../components/layouts/AuthLayout/AuthLayout";
import styles from "./Login.module.css";

export const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'erro' | 'sucesso' | ''}>({
        message: '',
        type: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback({ message: '', type: '' });

        const localErrors: { email?: string; senha?: string } = {};

        if (!formData.email.trim()) {
            localErrors.email = "Email obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            localErrors.email = "Email inválido";
        }

        if (!formData.senha) {
            localErrors.senha = "Senha obrigatória";
        }

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            setFeedback({ message: "Preencha os campos corretamente.", type: "erro"});
            return;
        }

        setIsSubmitting(true);
        try {
            await login(formData);
            setFeedback({ message: "Login realizado com sucesso!", type: "sucesso"});
            setTimeout(() => navigate('/vagas'), 1200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrorMessage = error.response?.data?.erro || "Email ou senha inválidos.";
            setFeedback({ message: apiErrorMessage, type: "erro"});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            imageSrc="https://www.netzpiloten.de/wp-content/uploads/2021/01/work-life-balance-home-office-1000x1000-1.jpg"
            imageAlt="Home Office Work-life balance"
        >
            {feedback.message && (
                <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                    {feedback.message}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <InputGroup
                    name="email"
                    type="email"
                    placeholder="Digite seu E-mail"
                    autoComplete="email"
                    icon="fa-solid fa-envelope"
                    value={formData.email}
                    onChange={handleChange}
                    errorMessage={errors.email}
                />

                <InputGroup 
                    name="senha"
                    type="password"
                    placeholder="Digite sua Senha"
                    autoComplete="current-password"
                    icon="fa-solid fa-lock"
                    value={formData.senha}
                    onChange={handleChange}
                    errorMessage={errors.senha}
                />

                <Button type="submit" icon="fa-solid fa-arrow-right-to-bracket" isLoading={isSubmitting}>
                    Entrar
                </Button>

                <p className={styles.cadastro}>
                    Não é cadastrado? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </form>
        </AuthLayout>
    );
};
