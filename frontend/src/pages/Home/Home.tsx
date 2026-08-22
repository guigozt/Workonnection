import { Topbar } from '../../components/Topbar/Topbar';
import { ModalVaga } from '../../components/ModalVaga/ModalVaga';
import { FloatingButton } from '../../components/FloatingButton/FloatingButton';
import { useHome } from './useHome';
import styles from './Home.module.css';

export const Home = () => {
  const {
    vagas,
    loading,
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

          {loading ? (
            <p>Carregando vagas...</p>
          ) : vagas.length === 0 ? (
            <p>Nenhuma vaga cadastrada no momento.</p>
          ) : (
            vagas.map((vaga) => (
              <div key={vaga.id} className={styles.vagaCard}>
                <h3>{vaga.cargo}</h3>
                <p><strong>Empresa:</strong> {vaga.empresa}</p>
                <p>{vaga.descricao}</p>
                <p><strong>Localização:</strong> {vaga.localizacao} | <strong>Salário:</strong> {vaga.salario}</p>
                <small>Publicado por: {vaga.nomeUsuario}</small>
              </div>
            ))
          )}
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
  );
};