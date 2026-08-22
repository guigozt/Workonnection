import { useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import { useNavigate } from "react-router-dom";

export const useLogin = () => {

    const auth = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        senha: ""
    });

    const [errors, setErrors] = useState<{
        email?: string;
        senha?: string;
    }>({});

    const [feedback, setFeedback] = useState<{
        message: string;
        type: "erro" | "sucesso" | "";
    }>({
        message: "",
        type: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof typeof errors]) {

            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));

        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        console.log("=================================");
        console.log("1. LOGIN: formulário enviado");
        console.log("Email:", formData.email);
        console.log(
            "Senha:",
            formData.senha ? "***" : "(vazia)"
        );
        console.log("AuthContext:", auth);
        console.log("login:", auth.login);
        console.log("=================================");

        setFeedback({
            message: "",
            type: ""
        });

        const localErrors: {
            email?: string;
            senha?: string;
        } = {};

        if (!formData.email.trim()) {

            localErrors.email = "Email obrigatório";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {

            localErrors.email = "Email inválido";

        }

        if (!formData.senha) {

            localErrors.senha = "Senha obrigatória";

        }

        if (Object.keys(localErrors).length > 0) {

            console.log(
                "2. LOGIN: validação local falhou"
            );

            console.log(
                "Erros:",
                localErrors
            );

            setErrors(localErrors);

            setFeedback({
                message: "Preencha os campos corretamente.",
                type: "erro"
            });

            return;
        }

        console.log(
            "2. LOGIN: validação local OK"
        );

        setIsSubmitting(true);

        try {

            console.log(
                "3. LOGIN: chamando AuthContext.login()"
            );

            await auth.login({
                email: formData.email.trim(),
                senha: formData.senha
            });

            console.log(
                "4. LOGIN: login realizado com sucesso"
            );

            setFeedback({
                message: "Login realizado com sucesso!",
                type: "sucesso"
            });

            setTimeout(() => {
                navigate("/home");
            }, 1200);

        } catch (error) {

            console.error(
                "❌ LOGIN: erro capturado"
            );

            console.error(
                "Erro completo:",
                error
            );

            if (error instanceof Error) {

                console.error(
                    "Mensagem:",
                    error.message
                );

            }

            setFeedback({
                message: "Email ou senha inválidos.",
                type: "erro"
            });

        } finally {

            console.log(
                "5. LOGIN: finalizando"
            );

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