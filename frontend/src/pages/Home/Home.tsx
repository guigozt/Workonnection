import { useState } from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga, type VagaData } from '../../components/ModalVaga/ModalVaga';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
import styles from './Home.module.css';

export const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vagaEmEdicao, setVagaEmEdicao] = useState<VagaData | null>(null);

    const handleAbrirCriacao = () => {
        setVagaEmEdicao(null);
        setIsModalOpen(true);
    };

    const handleSalvarVagaSucesso = (vaga: VagaData) => {
        console.log('Vaga salva com sucesso', vaga);
    };

    return (
        <div>
            <Topbar notificacoesNaoLidas={3} />

            <main className={styles.homeWrapper}>
                <div id="vagas-container">
                    <h2>Feed de Vagas</h2>
                </div>
            </main>

            <FloatingButton onClick={handleAbrirCriacao} title="Criar Nova Vaga" />

            <ModalVaga
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSalvarVagaSucesso}
                vagaParaEditar={vagaEmEdicao}
            />
        </div>
    )
}