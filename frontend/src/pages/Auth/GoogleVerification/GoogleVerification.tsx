import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../components/layouts/AuthLayout/AuthLayout";
import { InputGroup } from "../../../components/Input/InputGroup";
import { Button } from "../../../components/Button/Button";
import { api } from "../../../services/api";
import { maskCPF, maskPhone } from "../../../utils/masks";
import { validateCPF, calculateAge } from "../../../utils/validators";
import styles from "./GoogleVerification.module.css";

export const GoogleVerification = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        tipoUsuario: "Colaborador"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'erro' | 'sucesso' | '' }>({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch current user email from /usuarios/me to populate the request
        api.get('/usuarios/me').then(response => {
            if (response.data && response.data.email) {
                setUserEmail(response.data.email);
            }
        }).catch(err => {
            console.error("Not authenticated", err);
            navigate("/login");
        });
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') formattedValue = maskCPF(value);
        if (name === 'telefone') formattedValue = maskPhone(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.nome.trim().length < 3) newErrors.nome = 'Mínimo 3 caracteres';
        if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
        
        if (!formData.dataNascimento) {
            newErrors.dataNascimento = 'Data obrigatória';
        } else {
            const idade = calculateAge(formData.dataNascimento);
            if (idade < 16) newErrors.dataNascimento = 'Mínimo 16 anos';
            if (idade > 120) newErrors.dataNascimento = 'Data inválida';
        }

        if (formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone incompleto';

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
            await api.post('/auth/google/confirm', {
                email: userEmail,
                ...formData
            });
            
            setFeedback({ message: 'Cadastro completo com sucesso!', type: 'sucesso' });
            setTimeout(() => {
                window.location.href = '/home';
            }, 1500);
        } catch (error: any) {
            const errorMsg = error.response?.data?.erro || 'Erro ao conectar com o servidor.';
            setFeedback({ message: errorMsg, type: 'erro' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            imageSrc="https://www.netzpiloten.de/wp-content/uploads/2021/01/work-life-balance-home-office-1000x1000-1.jpg"
            imageAlt="Verificação Google"
        >
            <div className={styles.container}>
                <h2 style={{ textAlign: "center", marginBottom: "10px", color: "var(--text-color)" }}>Falta Pouco!</h2>
                <p style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-color-secondary)" }}>
                    Complete seus dados para finalizar o cadastro com sua conta Google.
                </p>

                {feedback.message && (
                    <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                        {feedback.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className={styles.form}>
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

                    <div className={styles.tipoUsuarioSelect}>
                        <label className={styles.tipoLabel}>Tipo de Conta</label>
                        <select
                            name="tipoUsuario"
                            value={formData.tipoUsuario}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="Colaborador">Colaborador</option>
                            <option value="Empresa">Empresa</option>
                        </select>
                    </div>

                    <Button type="submit" icon="fa-solid fa-check" isLoading={isSubmitting}>
                        Concluir Cadastro
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};
