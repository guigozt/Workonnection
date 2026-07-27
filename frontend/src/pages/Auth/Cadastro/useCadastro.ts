import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../../../services/usuarioService';
import { maskCPF, maskPhone } from '../../../utils/masks';
import { validateCPF, calculateAge } from '../../../utils/validators';

export const useCadastro = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipoUsuario: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'erro' | 'sucesso' | '' }>({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (errors.tipoUsuario) setErrors(prev => ({ ...prev, tipoUsuario: '' }))
    }

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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Email inválido';
        if (formData.senha.length < 6) newErrors.senha = 'Mínimo 6 caracteres';
        if (formData.confirmarSenha !== formData.senha) newErrors.confirmarSenha = 'Senhas não coincidem';
        if (!formData.tipoUsuario) newErrors.tipoUsuario = 'Selecione um tipo de usuário';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback({ message: '', type: '' });

        if (!validateForm()) {
            setFeedback({ message: 'Corrija os campos em destaques antes de continuar.', type: 'erro' });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                nome: formData.nome.trim(),
                cpf: formData.cpf,
                dataNascimento: formData.dataNascimento,
                telefone: formData.telefone,
                email: formData.email.trim(),
                senha: formData.senha,
                tipoUsuario: formData.tipoUsuario
            };

            await usuarioService.cadastrar(payload);
            setFeedback({ message: 'Cadastro realizado com sucesso!', type: 'sucesso' });
            setTimeout(() => navigate('/login'), 1500);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMsg = error.response?.data?.erro || 'Erro ao conectar com o servidor.';
            setFeedback({ message: errorMsg, type: 'erro' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        formData,
        errors,
        feedback,
        isSubmitting,
        handleChange,
        handleSelectTipo,
        handleSubmit,
        navigate
    }
}