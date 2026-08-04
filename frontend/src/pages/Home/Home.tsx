import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
import { useHome } from './useHome';
import styles from './Home.module.css';

export const Home = () => {
    const {
        isModalOpen,
        vagaEmEdicao,
        handleAbrirCriacao,
        handleFecharModal,
        handleSalvarVagaSucesso,
    } = useHome();

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
                onClose={handleFecharModal}
                onSuccess={handleSalvarVagaSucesso}
                vagaParaEditar={vagaEmEdicao}
            />
        </div>
    )
}