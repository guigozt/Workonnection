import { Link } from "react-router-dom";
import { InputGroup } from "../../../components/Input/InputGroup";
import { Button } from "../../../components/Button/Button";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import { useLogin } from "./useLogin";
import styles from "./Login.module.css";

export const Login = () => {
    const { formData, errors, feedback, isSubmitting, handleChange, handleSubmit } = useLogin();

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
                    label="E-mail"
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
                    label="Senha"
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