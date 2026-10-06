import React from 'react';
import type { PerfilData } from '../../types/perfil';
import styles from './SubperfilSection.module.css';

interface Props {
  tipoUsuario?: string;
  perfil: PerfilData;
  onEditar: () => void;
}

export const SubperfilSection: React.FC<Props> = ({
  tipoUsuario,
  perfil,
  onEditar,
}) => {
  const tipo = (tipoUsuario || 'ESTUDANTE').toUpperCase();

  const renderConteudo = () => {
    switch (tipo) {
      case 'ESTUDANTE': {
        const est = perfil.perfilEstudante || {};
        return (
          <div className={styles.gridCampos}>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Instituição de Ensino</span>
              <span className={est.instituicaoEnsino ? styles.campoValor : styles.campoVazio}>
                {est.instituicaoEnsino || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Curso</span>
              <span className={est.curso ? styles.campoValor : styles.campoVazio}>
                {est.curso || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Semestre / Ano</span>
              <span className={est.semestreAno ? styles.campoValor : styles.campoVazio}>
                {est.semestreAno || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Previsão de Conclusão</span>
              <span className={est.previsaoConclusao ? styles.campoValor : styles.campoVazio}>
                {est.previsaoConclusao || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Turno</span>
              <span className={est.turno ? styles.campoValor : styles.campoVazio}>
                {est.turno || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Matrícula</span>
              <span className={est.matricula ? styles.campoValor : styles.campoVazio}>
                {est.matricula || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Modalidade de Interesse</span>
              <span className={est.modalidadeInteresse ? styles.campoValor : styles.campoVazio}>
                {est.modalidadeInteresse || 'Não informada'}
              </span>
            </div>
          </div>
        );
      }

      case 'MEI': {
        const mei = perfil.perfilMei || {};
        return (
          <div className={styles.gridCampos}>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>CNPJ</span>
              <span className={mei.cnpj ? styles.campoValor : styles.campoVazio}>
                {mei.cnpj || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Razão Social</span>
              <span className={mei.razaoSocial ? styles.campoValor : styles.campoVazio}>
                {mei.razaoSocial || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Nome Fantasia</span>
              <span className={mei.nomeFantasia ? styles.campoValor : styles.campoVazio}>
                {mei.nomeFantasia || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Ocupação Principal</span>
              <span className={mei.ocupacaoPrincipal ? styles.campoValor : styles.campoVazio}>
                {mei.ocupacaoPrincipal || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Chave PIX</span>
              <span className={mei.chavePix ? styles.campoValor : styles.campoVazio}>
                {mei.chavePix || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Inscrição Municipal</span>
              <span className={mei.inscricaoMunicipal ? styles.campoValor : styles.campoVazio}>
                {mei.inscricaoMunicipal || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Emite Nota Fiscal</span>
              <span className={styles.campoValor}>
                {mei.emiteNotaFiscal ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        );
      }

      case 'ME': {
        const me = perfil.perfilMe || {};
        return (
          <div className={styles.gridCampos}>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>CNPJ</span>
              <span className={me.cnpj ? styles.campoValor : styles.campoVazio}>
                {me.cnpj || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Razão Social</span>
              <span className={me.razaoSocial ? styles.campoValor : styles.campoVazio}>
                {me.razaoSocial || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Nome Fantasia</span>
              <span className={me.nomeFantasia ? styles.campoValor : styles.campoVazio}>
                {me.nomeFantasia || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>CNAE Principal</span>
              <span className={me.cnaePrincipal ? styles.campoValor : styles.campoVazio}>
                {me.cnaePrincipal || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Inscrição Estadual</span>
              <span className={me.inscricaoEstadual ? styles.campoValor : styles.campoVazio}>
                {me.inscricaoEstadual || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Inscrição Municipal</span>
              <span className={me.inscricaoMunicipal ? styles.campoValor : styles.campoVazio}>
                {me.inscricaoMunicipal || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Regime Tributário</span>
              <span className={me.regimeTributario ? styles.campoValor : styles.campoVazio}>
                {me.regimeTributario || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Porte da Empresa</span>
              <span className={me.porteEmpresa ? styles.campoValor : styles.campoVazio}>
                {me.porteEmpresa || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Quantidade de Funcionários</span>
              <span className={me.quantidadeFuncionarios !== undefined ? styles.campoValor : styles.campoVazio}>
                {me.quantidadeFuncionarios !== undefined ? me.quantidadeFuncionarios : 'Não informado'}
              </span>
            </div>
          </div>
        );
      }

      case 'EMPRESA': {
        const emp = perfil.perfilEmpresa || {};
        return (
          <div className={styles.gridCampos}>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>CNPJ</span>
              <span className={emp.cnpj ? styles.campoValor : styles.campoVazio}>
                {emp.cnpj || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Razão Social</span>
              <span className={emp.razaoSocial ? styles.campoValor : styles.campoVazio}>
                {emp.razaoSocial || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Nome Fantasia</span>
              <span className={emp.nomeFantasia ? styles.campoValor : styles.campoVazio}>
                {emp.nomeFantasia || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Setor de Atuação</span>
              <span className={emp.setorAtuacao ? styles.campoValor : styles.campoVazio}>
                {emp.setorAtuacao || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Tamanho da Empresa</span>
              <span className={emp.tamanhoEmpresa ? styles.campoValor : styles.campoVazio}>
                {emp.tamanhoEmpresa || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Site Oficial</span>
              <span className={emp.siteOficial ? styles.campoValor : styles.campoVazio}>
                {emp.siteOficial || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Página de Carreiras</span>
              <span className={emp.paginaCarreiras ? styles.campoValor : styles.campoVazio}>
                {emp.paginaCarreiras || 'Não informada'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>E-mail RH</span>
              <span className={emp.contatoRhEmail ? styles.campoValor : styles.campoVazio}>
                {emp.contatoRhEmail || 'Não informado'}
              </span>
            </div>
            <div className={styles.campoItem}>
              <span className={styles.campoLabel}>Telefone RH</span>
              <span className={emp.contatoRhTelefone ? styles.campoValor : styles.campoVazio}>
                {emp.contatoRhTelefone || 'Não informado'}
              </span>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const getTitulo = () => {
    switch (tipo) {
      case 'ESTUDANTE':
        return 'Dados Acadêmicos';
      case 'MEI':
        return 'Dados de Microempreendedor (MEI)';
      case 'ME':
        return 'Dados Empresariais (ME)';
      case 'EMPRESA':
        return 'Dados Corporativos da Empresa';
      default:
        return 'Dados do Subperfil';
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.tituloSecao}>
          <i className="fas fa-id-card-clip" />
          <h3>{getTitulo()}</h3>
        </div>
        <button type="button" className={styles.btnEditar} onClick={onEditar}>
          <i className="fas fa-pen" />
          <span>Editar dados</span>
        </button>
      </div>

      {renderConteudo()}
    </section>
  );
};
