// Cadastro.tsx
import { Link, useLocation } from "react-router-dom";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import { InputGroup } from "../../../components/Input/InputGroup";
import { Button } from "../../../components/Button/Button";
import styles from "./Cadastro.module.css";
import { useCadastro } from "./useCadastro";

export const Cadastro = () => {
    const { formData, errors, feedback, isSubmitting, handleChange, handleSelectTipo, handleSubmit } = useCadastro();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');

    return (
        <AuthLayout
            imageSrc="https://bmvadvogados.adv.br/site/wp-content/uploads/2025/09/Microempreendedor.png"
            imageAlt="Jovem trabalhando em casa com laptop"
        >
            <div className={styles.container}>
                <h2 className={styles.title}>Cadastro</h2>

                {error && (
                    <div className={`${styles.feedback} ${styles.erro}`}>
                        Ocorreu um erro no cadastro. Tente novamente.
                    </div>
                )}

                {feedback.message && (
                    <div className={`${styles.feedback} ${feedback.type === 'erro' ? styles.erro : styles.sucesso}`}>
                        {feedback.message}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <InputGroup
                            label="Nome Completo" name="nome" type="text" placeholder="Nome completo" icon="fa-solid fa-user"
                            value={formData.nome} onChange={handleChange} errorMessage={errors.nome}
                        />
                        <InputGroup
                            label="CPF" name="cpf" type="text" placeholder="000.000.000-00" icon="fa-solid fa-id-card"
                            value={formData.cpf} onChange={handleChange} errorMessage={errors.cpf}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputGroup
                            label="Data de Nascimento" name="dataNascimento" type="date" icon="fa-solid fa-calendar"
                            value={formData.dataNascimento} onChange={handleChange} errorMessage={errors.dataNascimento}
                        />
                        <InputGroup
                            label="Telefone" name="telefone" type="tel" placeholder="(00) 00000-0000" icon="fa-solid fa-phone"
                            value={formData.telefone} onChange={handleChange} errorMessage={errors.telefone}
                        />
                    </div>

                    <div className={styles.formRowFull}>
                        <InputGroup
                            label="Email" name="email" type="email" placeholder="seu@email.com" icon="fa-solid fa-envelope"
                            value={formData.email} onChange={handleChange} errorMessage={errors.email}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputGroup
                            label="Senha" name="senha" type="password" placeholder="Senha" icon="fa-solid fa-lock"
                            value={formData.senha} onChange={handleChange} errorMessage={errors.senha}
                        />
                        <InputGroup
                            label="Confirmar Senha" name="confirmarSenha" type="password" placeholder="Confirmar Senha" icon="fa-solid fa-lock"
                            value={formData.confirmarSenha} onChange={handleChange} errorMessage={errors.confirmarSenha}
                        />
                    </div>

                    <div className={styles.tipoUsuarioSection}>
                        <label className={styles.tipoLabel}>Tipo de Conta</label>
                        <div className={styles.userTypeBox}>
                            {[
                                { value: 'empresa', label: 'Empresa', icon: 'fa-solid fa-building' },
                                { value: 'microempreendedor', label: 'Micro empreendedor', icon: 'fa-solid fa-user-tie' },
                                { value: 'microempresa', label: 'Micro empresa', icon: 'fa-solid fa-store' },
                                { value: 'estudante', label: 'Estudante', icon: 'fa-solid fa-graduation-cap' }
                            ].map((tipo) => (
                                <button
                                    type="button"
                                    key={tipo.value}
                                    className={`${styles.userBtn} ${formData.tipoUsuario === tipo.value ? styles.ativo : ''}`}
                                    onClick={() => handleSelectTipo(tipo.value)}
                                >
                                    <i className={tipo.icon}></i>
                                    {tipo.label}
                                </button>
                            ))}
                        </div>
                        {errors.tipoUsuario && <span className={styles.typeError}>{errors.tipoUsuario}</span>}
                    </div>

                    <p className={styles.loginHint}>
                        Já é cadastrado? <Link to="/login">Faça Login</Link>
                    </p>

                    <div className={styles.buttons}>
                        <Button type="submit" isLoading={isSubmitting} icon="fa-solid fa-check">
                            Cadastrar
                        </Button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};
