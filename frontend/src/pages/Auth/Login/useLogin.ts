import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
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
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            setTimeout(() => navigate('/home'), 1200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrorMessage = error.response?.data?.erro || "Email ou senha inválidos.";
            setFeedback({ message: apiErrorMessage, type: "erro"});
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        feedback,
        isSubmitting,
        handleChange,
        handleSubmit
    };
};