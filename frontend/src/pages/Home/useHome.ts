import { useState } from 'react';
import { type VagaData } from '../../components/ModalVaga/ModalVaga';

export const useHome = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vagaEmEdicao, setVagaEmEdicao] = useState<VagaData | null>(null);

    const handleAbrirCriacao = () => {
        setVagaEmEdicao(null);
        setIsModalOpen(true);
    };

    const handleFecharModal = () => {
        setIsModalOpen(false);
        setVagaEmEdicao(null);
    };

    const handleSalvarVagaSucesso = (vaga: VagaData) => {
        console.log('Vaga salva com sucesso:', vaga);
    };

    return {
        isModalOpen,
        vagaEmEdicao,
        handleAbrirCriacao,
        handleFecharModal,
        handleSalvarVagaSucesso,
    };
};
