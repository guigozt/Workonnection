import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import { InputGroup } from "../../../components/Input/InputGroup";
import { Button } from "../../../components/Button/Button";
import { useAuth } from "../../../context/useAuth";
import { maskCPF, maskPhone } from "../../../utils/masks";
import { validateCPF, calculateAge } from "../../../utils/validators";
import styles from "./Cadastro.module.css";

export const Cadastro = () => {
    const navigate = useNavigate();
    const { usuario, loading, completarCadastro, logout } = useAuth();

    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        tipoUsuario: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'erro' | 'sucesso' | '' }>({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVoltarLogin = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        if (!loading) {
            if (!usuario) {
                navigate("/login", { replace: true });
                return;
            }

            if (usuario.cadastroCompleto) {
                navigate("/home", { replace: true });
                return;
            }

            setFormData(prev => {
                const novoNome = usuario.nome || "";
                const novoCpf = usuario.cpf || "";
                const novaData = usuario.dataNascimento || "";
                const novoTelefone = usuario.telefone || "";
                const novoTipo = usuario.tipoUsuario || "";

                if (
                    prev.nome === novoNome &&
                    prev.cpf === novoCpf &&
                    prev.dataNascimento === novaData &&
                    prev.telefone === novoTelefone &&
                    prev.tipoUsuario === novoTipo
                ) {
                    return prev;
                }

                return {
                    nome: novoNome,
                    cpf: novoCpf,
                    dataNascimento: novaData,
                    telefone: novoTelefone,
                    tipoUsuario: novoTipo
                };
            });
        }
    }, [usuario, loading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') formattedValue = maskCPF(value);
        if (name === 'telefone') formattedValue = maskPhone(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSelectTipo = (tipo: string) => {
        setFormData(prev => ({ ...prev, tipoUsuario: tipo }));
        if (errors.tipoUsuario) setErrors(prev => ({ ...prev, tipoUsuario: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.nome.trim().length < 3) newErrors.nome = 'Mínimo 3 caracteres';
        if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';

        if (!formData.dataNascimento) {
            newErrors.dataNascimento = 'Obrigatório';
        } else if (calculateAge(formData.dataNascimento) < 16) {
            newErrors.dataNascimento = 'Mínimo 16 anos';
        }

        if (formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Incompleto';
        if (!formData.tipoUsuario) newErrors.tipoUsuario = 'Selecione o tipo de conta';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback({ message: '', type: '' });

        if (!validateForm()) {
            setFeedback({ message: 'Corrija os campos em destaque antes de continuar.', type: 'erro' });
            return;
        }

        setIsSubmitting(true);
        try {
            await completarCadastro(formData);

            setFeedback({ message: 'Cadastro finalizado com sucesso!', type: 'sucesso' });
            setTimeout(() => {
                navigate('/home', { replace: true });
            }, 1000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; erro?: string } } };
            const errorMsg = err.response?.data?.message || err.response?.data?.erro || 'Erro ao processar o cadastro.';
            setFeedback({ message: errorMsg, type: 'erro' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AuthLayout
                imageSrc="https://bmvadvogados.adv.br/site/wp-content/uploads/2025/09/Microempreendedor.png"
                imageAlt="Completar Cadastro"
            >
                <div className={styles.container}>
                    <p className={styles.subtitle}>Carregando dados da sua conta...</p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            imageSrc="https://bmvadvogados.adv.br/site/wp-content/uploads/2025/09/Microempreendedor.png"
            imageAlt="Completar Cadastro"
        >
            <div className={styles.container}>
                <h2 className={styles.title}>Complete seu Cadastro</h2>
                <p className={styles.subtitle}>
                    Falta pouco! Preencha os dados abaixo para finalizar sua conta.
                </p>

                {feedback.message && (
                    <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                        {feedback.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                    <div className={styles.formRow}>
                        <InputGroup
                            label="Nome Completo"
                            name="nome"
                            type="text"
                            placeholder="Seu nome"
                            icon="fa-solid fa-user"
                            value={formData.nome}
                            onChange={handleChange}
                            errorMessage={errors.nome}
                        />
                        <InputGroup
                            label="CPF"
                            name="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            icon="fa-solid fa-id-card"
                            value={formData.cpf}
                            onChange={handleChange}
                            errorMessage={errors.cpf}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputGroup
                            label="Data de Nascimento"
                            name="dataNascimento"
                            type="date"
                            icon="fa-solid fa-calendar"
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            errorMessage={errors.dataNascimento}
                        />
                        <InputGroup
                            label="Telefone"
                            name="telefone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            icon="fa-solid fa-phone"
                            value={formData.telefone}
                            onChange={handleChange}
                            errorMessage={errors.telefone}
                        />
                    </div>

                    <div className={styles.tipoUsuarioSection}>
                        <label className={styles.tipoLabel}>Tipo de Conta</label>
                        <div className={styles.userTypeBox}>
                            {[
                                { value: 'Empresa', label: 'Empresa', icon: 'fa-solid fa-building' },
                                { value: 'Microempreendedor', label: 'Micro empreendedor', icon: 'fa-solid fa-user-tie' },
                                { value: 'Microempresa', label: 'Micro empresa', icon: 'fa-solid fa-store' },
                                { value: 'Estudante', label: 'Estudante', icon: 'fa-solid fa-graduation-cap' }
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

                    <div className={styles.buttons}>
                        <Button type="submit" icon="fa-solid fa-check" isLoading={isSubmitting}>
                            Concluir Cadastro
                        </Button>
                    </div>

                    <p className={styles.loginHint}>
                        Deseja entrar com outra conta?{' '}
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={handleVoltarLogin}
                        >
                            Voltar ao Login
                        </button>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};